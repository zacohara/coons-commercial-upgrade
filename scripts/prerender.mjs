// Build-time pre-rendering: renders every route to a static HTML file so
// crawlers (Google, Bing, AI bots, social previews) get real content + a
// unique <title>/<meta>/<canonical> per page. Run AFTER the client build and
// the SSR build:
//   vite build                                   -> dist/ (template + assets)
//   vite build --ssr src/entry-server.jsx --outDir dist-server
//   node scripts/prerender.mjs
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const { render, ROUTES, BLOG, BLOG_SEO } = await import(
  pathToFileURL(join(root, 'dist-server/entry-server.js')).href
)

const template = readFileSync(join(root, 'dist', 'index.html'), 'utf-8')

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const escAttr = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;')

function buildPage(html, head) {
  let out = template
  out = out.replace('<div id="root"></div>', `<div id="root">${html}</div>`)
  out = out.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(head.title)}</title>`)
  out = out.replace(
    /<meta name="description" content="[^"]*"\s*\/>/,
    `<meta name="description" content="${escAttr(head.description)}" />`,
  )
  out = out.replace(
    /<link rel="canonical" href="[^"]*"\s*\/>/,
    `<link rel="canonical" href="${head.canonical}" />`,
  )
  // keep OG url in sync with the canonical
  out = out.replace(
    /<meta property="og:url" content="[^"]*"\s*\/>/,
    `<meta property="og:url" content="${head.canonical}" />`,
  )
  // per-page social cards. Without these every page inherited the homepage
  // title, so shared links all previewed as "Coons Roofing | Commercial Roofing".
  out = out.replace(
    /<meta property="og:title" content="[^"]*"\s*\/>/,
    `<meta property="og:title" content="${escAttr(head.title)}" />`,
  )
  out = out.replace(
    /<meta property="og:description" content="[^"]*"\s*\/>/,
    `<meta property="og:description" content="${escAttr(head.description)}" />`,
  )
  out = out.replace(
    /<meta name="twitter:title" content="[^"]*"\s*\/>/,
    `<meta name="twitter:title" content="${escAttr(head.title)}" />`,
  )
  out = out.replace(
    /<meta name="twitter:description" content="[^"]*"\s*\/>/,
    `<meta name="twitter:description" content="${escAttr(head.description)}" />`,
  )
  if (head.ogType) {
    out = out.replace(
      /<meta property="og:type" content="[^"]*"\s*\/>/,
      `<meta property="og:type" content="${head.ogType}" />`,
    )
  }
  if (head.image) {
    out = out.replace(
      /<meta property="og:image" content="[^"]*"\s*\/>/,
      `<meta property="og:image" content="${head.image}" />`,
    )
    out = out.replace(
      /<meta name="twitter:image" content="[^"]*"\s*\/>/,
      `<meta name="twitter:image" content="${head.image}" />`,
    )
  }
  // inject per-page JSON-LD (BreadcrumbList, Service) before </head>
  if (head.jsonld && head.jsonld.length) {
    const scripts = head.jsonld
      .map((o) => `<script type="application/ld+json">${JSON.stringify(o)}</script>`)
      .join('\n    ')
    out = out.replace('</head>', `    ${scripts}\n  </head>`)
  }
  return out
}

const SITE = 'https://coonsroofing.com'
const LASTMOD = '2026-08-02'

let count = 0
const urls = []
for (const route of ROUTES) {
  const { html, head } = render(route)
  const page = buildPage(html, head)
  const outPath =
    route === 'home'
      ? join(root, 'dist', 'index.html')
      : join(root, 'dist', route, 'index.html')
  mkdirSync(dirname(outPath), { recursive: true })
  writeFileSync(outPath, page)
  urls.push(head.canonical)
  count++
  console.log('prerendered', route, '->', outPath.replace(root, ''))
}

// Legacy URLs from the pre-2026 site. These previously 404'd, so nothing
// Google had indexed carried across. A 200 + instant refresh + canonical is the
// closest thing to a 301 available on GitHub Pages.
const LEGACY = {
  'services': '/', 'service-areas': '/houston/', 'financing': '/',
  'gallery': '/projects/', 'about-us': '/about/', 'contact-us': '/',
  'kemah-tx': '/league-city/', 'roof-repair': '/repair/',
  'roof-replacement': '/replacement/', 'commercial-roofing': '/',
}
for (const [from, to] of Object.entries(LEGACY)) {
  const target = SITE + to
  const stub = `<!doctype html><html lang="en"><head><meta charset="UTF-8" />
<title>Moved | Coons Roofing</title>
<link rel="canonical" href="${target}" />
<meta name="robots" content="noindex, follow" />
<meta http-equiv="refresh" content="0; url=${to}" />
<script>window.location.replace(${JSON.stringify(to)})</script>
</head><body><p>This page has moved. <a href="${to}">Continue to Coons Roofing</a>.</p></body></html>`
  const lp = join(root, 'dist', from, 'index.html')
  mkdirSync(dirname(lp), { recursive: true })
  writeFileSync(lp, stub)
}
console.log('wrote', Object.keys(LEGACY).length, 'legacy redirect stubs')

// Static legal pages (served from public/, not React routes)
urls.push(SITE + '/privacy/', SITE + '/terms/')

const sitemap =
  '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  urls
    .map(
      (u) =>
        `  <url><loc>${u}</loc><lastmod>${LASTMOD}</lastmod><changefreq>weekly</changefreq></url>`,
    )
    .join('\n') +
  '\n</urlset>\n'
writeFileSync(join(root, 'dist', 'sitemap.xml'), sitemap)
console.log('wrote sitemap.xml with', urls.length, 'urls')

// Build-time RSS feed for the blog. A discovery surface for aggregators and AI
// crawlers, and a freshness signal Google reads. Built from the same BLOG array
// the pages render from, so it cannot drift.
// Twelve of the sixteen posts predate the `published` field and only carry a
// month. BlogPosting schema already falls back to 2026-03-15 for those, so the
// feed uses the same date rather than inventing a different one or dropping
// three quarters of the blog.
const PUBLISHED_FALLBACK = '2026-03-15'
const pubDateOf = (p) => p.published || PUBLISHED_FALLBACK
const posts = [...BLOG].sort((a, b) => (pubDateOf(a) < pubDateOf(b) ? 1 : -1))

const rfc822 = (d) => new Date(`${d}T12:00:00Z`).toUTCString()
const firstProse = (body) => {
  const p = body.find((b) => typeof b === 'string')
  return p ? p.slice(0, 300) : ''
}

const feedItems = posts
  .map((p) => {
    const url = `${SITE}/blog/${p.slug}/`
    const desc = BLOG_SEO[p.slug]?.d || firstProse(p.body)
    return `    <item>
      <title>${esc(p.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${rfc822(pubDateOf(p))}</pubDate>
      <author>wade@coonsroofing.com (Wade Coons)</author>
      <description>${esc(desc)}</description>
    </item>`
  })
  .join('\n')

const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Coons Roofing Blog</title>
    <link>${SITE}/blog/</link>
    <atom:link href="${SITE}/feed.xml" rel="self" type="application/rss+xml" />
    <description>Commercial roofing guidance for Houston property managers and building owners: maintenance, repair, coatings, metal roof restoration and replacement.</description>
    <language>en-us</language>
    <lastBuildDate>${posts.length ? rfc822(pubDateOf(posts[0])) : new Date().toUTCString()}</lastBuildDate>
${feedItems}
  </channel>
</rss>
`
writeFileSync(join(root, 'dist', 'feed.xml'), feed)
console.log('wrote feed.xml with', posts.length, 'items')

console.log(`\n✓ pre-rendered ${count} routes`)
