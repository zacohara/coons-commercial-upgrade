// Runs the REAL attribution block out of src/App.jsx against a DOM shim.
import { readFileSync } from 'node:fs'

const src = readFileSync('src/App.jsx', 'utf-8')
const start = src.indexOf('const FT_COOKIE = "cr_ft";')
const endMark = '\nconst GHL_WEBHOOK_URL'
const block = src.slice(start, src.indexOf(endMark, start))
if (start < 0 || !block.includes('function leadContext')) throw new Error('could not slice the attribution block')

const jar = new Map()
const doc = {
  referrer: '',
  title: 'Test Page',
  get cookie() { return [...jar].map(([k, v]) => `${k}=${v}`).join('; ') },
  set cookie(str) {
    const [pair] = str.split(';')
    const i = pair.indexOf('=')
    jar.set(pair.slice(0, i).trim(), pair.slice(i + 1))
  },
}
const win = {}
const setPage = (url, referrer = '') => {
  const u = new URL(url)
  win.location = { href: u.href, pathname: u.pathname, search: u.search, hostname: u.hostname, protocol: u.protocol }
  doc.referrer = referrer
}

const api = new Function('window', 'document', 'URLSearchParams', 'URL',
  block + '\nreturn { recordTouch, leadContext, attrParams, readCookie, FT_COOKIE, LT_COOKIE };'
)(win, doc, URLSearchParams, URL)

let failures = 0
const check = (label, actual, expected) => {
  const ok = actual === expected
  if (!ok) failures++
  console.log(`  ${ok ? 'ok  ' : 'FAIL'}  ${label}: ${JSON.stringify(actual)}${ok ? '' : ` (expected ${JSON.stringify(expected)})`}`)
}

console.log('\n1. Paid click lands on the metal page')
setPage('https://coonsroofing.com/metal-roof-coating-houston/?utm_source=google&utm_medium=cpc&utm_campaign=metal-aug&gclid=ABC123', 'https://www.google.com/')
api.recordTouch()
let ft = api.readCookie(api.FT_COOKIE)
check('first touch source', ft.utm_source, 'google')
check('first touch campaign', ft.utm_campaign, 'metal-aug')
check('first touch gclid', ft.gclid, 'ABC123')
check('first touch landing', ft.landing_path, '/metal-roof-coating-houston/')

console.log('\n2. Reads three pages, converts on /contact/ with no params')
setPage('https://coonsroofing.com/repair/', 'https://coonsroofing.com/metal-roof-coating-houston/')
api.recordTouch()
setPage('https://coonsroofing.com/contact/', 'https://coonsroofing.com/repair/')
api.recordTouch()
let ctx = api.leadContext()
check('page_path is the converting page', ctx.page_path, '/contact/')
check('utm_source on the converting url', ctx.utm_source, undefined)
check('first touch survived', ctx.ft_utm_source, 'google')
check('first touch campaign survived', ctx.ft_utm_campaign, 'metal-aug')
check('gclid survived', ctx.ft_gclid, 'ABC123')
check('last touch not clobbered by internal nav', ctx.lt_utm_campaign, 'metal-aug')
check('GA4 lead_source', api.attrParams().lead_source, 'google')

console.log('\n3. Comes back later from an AI assistant')
setPage('https://coonsroofing.com/repair/', 'https://chatgpt.com/')
api.recordTouch()
ctx = api.leadContext()
check('first touch still the paid click', ctx.ft_utm_source, 'google')
check('last touch is now chatgpt', ctx.lt_utm_source, 'chatgpt.com')
check('last touch medium', ctx.lt_utm_medium, 'ai_search')

console.log('\n4. Gemini must classify as AI, not Google organic')
jar.clear()
setPage('https://coonsroofing.com/', 'https://gemini.google.com/')
api.recordTouch()
check('medium', api.readCookie(api.FT_COOKIE).utm_medium, 'ai_search')

console.log('\n5. Brand new direct visitor')
jar.clear()
setPage('https://coonsroofing.com/', '')
api.recordTouch()
ft = api.readCookie(api.FT_COOKIE)
check('first touch recorded even when direct', ft.landing_path, '/')
check('no source invented', ft.utm_source, undefined)
check('last touch NOT written for a direct hit', api.readCookie(api.LT_COOKIE), null)

console.log('\n6. Organic search visitor')
jar.clear()
setPage('https://coonsroofing.com/houston/', 'https://www.bing.com/search?q=houston+commercial+roofing')
api.recordTouch()
ft = api.readCookie(api.FT_COOKIE)
check('source', ft.utm_source, 'bing.com')
check('medium', ft.utm_medium, 'organic')

console.log(failures ? `\n${failures} FAILURE(S)` : '\nAll attribution assertions passed.')
process.exit(failures ? 1 : 0)
