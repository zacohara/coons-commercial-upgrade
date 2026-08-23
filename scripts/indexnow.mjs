// IndexNow ping. Instant URL discovery for Bing, Yandex, Seznam and Naver, and
// Bing is what feeds Copilot and several ChatGPT search surfaces. Google
// ignores IndexNow entirely, which costs nothing.
//
//   node scripts/indexnow.mjs            submit only pages whose content changed
//   node scripts/indexnow.mjs --all      submit every page in the sitemap
//   node scripts/indexnow.mjs --dry-run  print what would be submitted
//   node scripts/indexnow.mjs <url> ...  submit specific urls
//
// Run AFTER the build and AFTER the deploy, never before: the endpoint fetches
// the URLs it is given, so submitting a page that is not live yet wastes the
// crawl.
//
// Change detection hashes the pre-rendered content of each page (the rendered
// body plus title and description) and not the whole file, because Vite asset
// filenames change on every build and would mark all 48 pages as changed.
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const SITE = 'https://coonsroofing.com'
const HOST = 'coonsroofing.com'
const KEY = '215b8c571a187a6966afb92e2aa09eba'
const KEY_LOCATION = `${SITE}/${KEY}.txt`
const MANIFEST = join(root, 'docs', 'url-hashes.json')
const ENDPOINT = 'https://api.indexnow.org/indexnow'

const args = process.argv.slice(2)
const dryRun = args.includes('--dry-run')
const all = args.includes('--all')
const explicit = args.filter((a) => a.startsWith('http'))

// Walk dist/ for every index.html and turn its path back into a live URL.
function pages(dir = join(root, 'dist'), out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) pages(full, out)
    else if (entry === 'index.html') {
      // The legacy redirect stubs are noindex on purpose. Submitting them would
      // ask Bing to crawl ten pages we are explicitly telling it to ignore.
      if (/<meta name="robots" content="noindex/.test(readFileSync(full, 'utf-8'))) continue
      const rel = relative(join(root, 'dist'), dirname(full))
      out.push({ url: rel ? `${SITE}/${rel}/` : `${SITE}/`, file: full })
    }
  }
  return out
}

// Hash only what a reader would notice changing.
function contentHash(file) {
  const html = readFileSync(file, 'utf-8')
  // Everything from the pre-rendered root div to </body>. Vite emits the module
  // script into <head>, so the body slice carries no content-hashed filenames
  // and is stable across rebuilds. Scripts are stripped anyway, defensively.
  const start = html.indexOf('<div id="root">')
  const end = html.indexOf('</body>')
  const body = start >= 0 && end > start
    ? html.slice(start, end).replace(/<script[\s\S]*?<\/script>/g, '')
    : html
  const title = (html.match(/<title>([\s\S]*?)<\/title>/) || [, ''])[1]
  const desc = (html.match(/<meta name="description" content="([^"]*)"/) || [, ''])[1]
  return createHash('sha256').update(title + '\u0000' + desc + '\u0000' + body).digest('hex').slice(0, 16)
}

if (!existsSync(join(root, 'dist'))) {
  console.error('dist/ not found. Run npm run build first.')
  process.exit(1)
}
if (!existsSync(join(root, 'public', `${KEY}.txt`))) {
  console.error(`public/${KEY}.txt is missing. IndexNow verifies ownership by fetching it.`)
  process.exit(1)
}

const found = pages()
const previous = existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, 'utf-8')) : {}
const current = {}
const changed = []
for (const p of found) {
  const h = contentHash(p.file)
  current[p.url] = h
  if (previous[p.url] !== h) changed.push(p.url)
}

let urlList = explicit.length ? explicit : all ? found.map((p) => p.url) : changed
const isFirstRun = !existsSync(MANIFEST)
if (isFirstRun && !explicit.length && !all) {
  console.log(`No manifest yet, so all ${found.length} pages look new.`)
  console.log('Recording the baseline without submitting. Re-run after the next content change,')
  console.log('or pass --all to submit everything now.')
  urlList = []
}

if (!urlList.length) {
  console.log('Nothing to submit.')
  if (!dryRun) {
    writeFileSync(MANIFEST, JSON.stringify(current, null, 2) + '\n')
    console.log(`Manifest written: ${relative(root, MANIFEST)} (${Object.keys(current).length} urls)`)
  }
  process.exit(0)
}

console.log(`${urlList.length} url(s) to submit:`)
for (const u of urlList) console.log(`  ${u}`)

if (dryRun) { console.log('\nDry run. Nothing submitted.'); process.exit(0) }

const res = await fetch(ENDPOINT, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList }),
})
const text = await res.text()
// 200 accepted, 202 accepted but the key is still being validated
if (res.status === 200 || res.status === 202) {
  console.log(`\nIndexNow accepted the submission (HTTP ${res.status}).`)
  writeFileSync(MANIFEST, JSON.stringify(current, null, 2) + '\n')
  console.log(`Manifest updated: ${relative(root, MANIFEST)}`)
} else {
  console.error(`\nIndexNow rejected the submission: HTTP ${res.status}`)
  console.error(text.slice(0, 500))
  console.error('Manifest left unchanged so the next run retries these urls.')
  process.exit(1)
}
