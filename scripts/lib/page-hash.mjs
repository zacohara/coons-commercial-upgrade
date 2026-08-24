// Shared content fingerprint for a built page.
//
// Used by scripts/indexnow.mjs to decide what to submit and by
// scripts/prerender.mjs to decide when a sitemap lastmod should move. Both have
// to agree on what "changed" means, so the logic lives here rather than being
// copied into each.
//
// Fields are joined with a NUL, written as an escape so the source stays
// plain ASCII. NUL cannot occur in the extracted HTML, so it cannot be
// confused with real content the way a space or a comma could.
//
// The hash deliberately covers only what a reader would notice: the rendered
// body, the title and the description. It excludes head asset references,
// because Vite emits content-hashed filenames that change on every build and
// would otherwise mark all 48 pages as changed every time.
import { createHash } from 'node:crypto'

export function hashPageHtml(html) {
  const start = html.indexOf('<div id="root">')
  const end = html.indexOf('</body>')
  const body = start >= 0 && end > start
    ? html.slice(start, end).replace(/<script[\s\S]*?<\/script>/g, '')
    : html
  const title = (html.match(/<title>([\s\S]*?)<\/title>/) || [, ''])[1]
  const desc = (html.match(/<meta name="description" content="([^"]*)"/) || [, ''])[1]
  return createHash('sha256')
    .update([title, desc, body].join('\u0000'))
    .digest('hex')
    .slice(0, 16)
}

export const isNoindex = (html) => /<meta name="robots" content="noindex/.test(html)
