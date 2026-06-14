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
const { render, ROUTES } = await import(
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
  return out
}

const SITE = 'https://coonsroofing.com'
const LASTMOD = '2026-06-14'

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

console.log(`\n✓ pre-rendered ${count} routes`)
