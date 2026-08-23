// GoDaddy zone tool for coonsroofing.com. Three modes: backup, plan, apply.
//
//   node scripts/godaddy-dns.mjs backup          snapshot the live zone to docs/
//   node scripts/godaddy-dns.mjs plan            diff dns-plan.json against live, no writes
//   node scripts/godaddy-dns.mjs plan --from <backup.json>   same diff, offline, no PAT needed
//   node scripts/godaddy-dns.mjs apply <id> --confirm    apply exactly ONE planned item
//
// Auth: GODADDY_PAT env var, a Personal Access Token from developer.godaddy.com
// with DNS read/write scope. Sent as "Authorization: Bearer <token>". The legacy
// sso-key header does not work on the v3 Domains API. The token is never printed.
//
// API shape verified against https://developer.godaddy.com/openapi/domains-v3.json
//   GET    /v3/domains/zones/{zone}/dns-records            paginated list
//   POST   /v3/domains/zones/{zone}/dns-records            create
//   PUT    /v3/domains/zones/{zone}/dns-records/{recordId} replace
// Records carry a server-assigned recordId that is stable across updates.
//
// SAFETY (hard-coded, not configurable):
//   1. A, MX, NS, SOA records are never written or deleted. The site and Wade's
//      email live on them.
//   2. The apex and www CNAME/A records are never touched.
//   3. This tool cannot delete anything. There is no delete path.
//   4. apply refuses to run without a zone backup taken today.
//   5. apply does one record per invocation, then verifies propagation over DNS
//      over HTTPS before exiting.
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { dirname, isAbsolute, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const ZONE = 'coonsroofing.com'
const BASE = 'https://api.godaddy.com/v3/domains'

const PROTECTED_TYPES = new Set(['A', 'AAAA', 'MX', 'NS', 'SOA'])
const PROTECTED_NAMES = new Set(['@', 'www'])
const WRITABLE_TYPES = new Set(['TXT', 'CNAME'])

const die = (msg) => { console.error(`\nREFUSED: ${msg}\n`); process.exit(1) }
const stamp = () => new Date().toISOString().slice(0, 10).replace(/-/g, '')

function token() {
  const t = process.env.GODADDY_PAT
  if (!t) die('GODADDY_PAT is not set. Generate a PAT (DNS read/write) at developer.godaddy.com and export it.')
  return t
}

async function api(path, { method = 'GET', body } = {}) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token()}`,
      Accept: 'application/json',
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  })
  const text = await res.text()
  if (!res.ok) {
    // never echo the token; the response body is safe to show
    throw new Error(`${method} ${path} -> HTTP ${res.status}\n${text.slice(0, 800)}`)
  }
  return text ? JSON.parse(text) : null
}

async function listRecords() {
  const out = []
  for (let page = 1; page <= 40; page++) {
    const r = await api(`/zones/${ZONE}/dns-records?page=${page}&pageSize=100&totalRequired=true`)
    const items = r.items || []
    out.push(...items)
    const total = r.totalPages ?? 1
    if (page >= total || items.length === 0) break
  }
  return out
}

// ---------------------------------------------------------------- guardrails

// Pure check on the plan itself. Runs before any network call, so a dangerous
// plan is refused without the tool ever authenticating.
function staticSafety(item) {
  const type = String(item.type || '').toUpperCase()
  const name = String(item.name || '')
  if (PROTECTED_TYPES.has(type)) return `item ${item.id} targets a ${type} record. A/AAAA/MX/NS/SOA are protected.`
  if (!WRITABLE_TYPES.has(type)) return `item ${item.id} type ${type} is not writable by this tool. TXT and CNAME only.`
  if (type === 'CNAME' && PROTECTED_NAMES.has(name)) return `item ${item.id} would write a CNAME at "${name}". The apex and www are protected.`
  if (!['ADD', 'REPLACE'].includes(item.action)) return `item ${item.id} action "${item.action}" is not supported. This tool cannot delete.`
  if (item.action === 'REPLACE' && !item.match) return `item ${item.id} is a REPLACE with no match expression, so it cannot identify one record.`
  return null
}

// Second check, once the live record the write would land on is known.
function assertSafe(item, target) {
  const type = String(item.type || '').toUpperCase()
  const err = staticSafety(item)
  if (err) die(err)
  if (target) {
    const tType = String(target.type).toUpperCase()
    if (PROTECTED_TYPES.has(tType)) die(`plan item ${item.id} resolved to an existing ${tType} record. Protected.`)
    if (tType === 'CNAME' && PROTECTED_NAMES.has(target.name)) die(`plan item ${item.id} resolved to the ${target.name} CNAME. Protected.`)
    if (tType !== type) die(`plan item ${item.id} is ${type} but resolved to an existing ${tType} record.`)
  }
}

// ------------------------------------------------------------------- backup

function backupPath() { return join(root, 'docs', `dns-backup-${stamp()}.json`) }

async function backup() {
  const records = await listRecords()
  const path = backupPath()
  writeFileSync(path, JSON.stringify({ zone: ZONE, takenAt: new Date().toISOString(), count: records.length, records }, null, 2) + '\n')
  console.log(`Backed up ${records.length} records from ${ZONE}`)
  console.log(`  ${path.replace(root + '/', '')}`)
  const byType = {}
  for (const r of records) byType[r.type] = (byType[r.type] || 0) + 1
  console.log(`  ${Object.entries(byType).map(([t, n]) => `${t}:${n}`).join('  ')}`)
  console.log('\nCommit this file before applying anything.')
}

// --------------------------------------------------------------------- plan

function loadPlan() {
  const p = join(root, 'dns-plan.json')
  if (!existsSync(p)) die('dns-plan.json not found at the repo root.')
  const plan = JSON.parse(readFileSync(p, 'utf-8'))
  if (plan.zone !== ZONE) die(`dns-plan.json is for zone "${plan.zone}", this tool only writes ${ZONE}.`)
  for (const item of plan.items) {
    const err = staticSafety(item)
    if (err) die(`dns-plan.json ${err}`)
  }
  return plan
}

const PLACEHOLDER = /^\s*\[|PASTE|TBD/i
const isReady = (item) => item.data != null && !PLACEHOLDER.test(String(item.data)) && item.stage !== 'later'

// Resolve a plan item against the live zone. Returns
// { state, target } where state is one of:
//   applied   live already matches the planned value
//   change    a single existing record will be replaced
//   create    a new record will be added
//   blocked   the value is still a placeholder, or the item is staged for later
//   conflict  the match expression hit zero or several records
function resolve(item, live) {
  const type = String(item.type).toUpperCase()
  const same = live.filter((r) => String(r.type).toUpperCase() === type && r.name === item.name)

  if (item.action === 'REPLACE') {
    const hits = same.filter((r) => String(r.data).includes(item.match))
    if (hits.length === 0) return { state: 'conflict', why: `no ${type} record at "${item.name}" contains "${item.match}"` }
    if (hits.length > 1) return { state: 'conflict', why: `${hits.length} ${type} records at "${item.name}" contain "${item.match}"; match is ambiguous` }
    const target = hits[0]
    if (!isReady(item)) return { state: 'blocked', target }
    if (String(target.data) === String(item.data)) return { state: 'applied', target }
    return { state: 'change', target }
  }

  if (item.action === 'ADD') {
    if (same.some((r) => String(r.data) === String(item.data))) return { state: 'applied' }
    if (!isReady(item)) return { state: 'blocked' }
    if (type === 'CNAME' && same.length > 0) {
      return { state: 'conflict', why: `a CNAME already exists at "${item.name}" pointing to ${same[0].data}. Resolve by hand.` }
    }
    return { state: 'create' }
  }

  return { state: 'conflict', why: `unknown action "${item.action}"` }
}

// Items that must not be applied before an earlier item is live. Sequence
// matters in Workstream I: DKIM has to be authenticating before SPF is
// tightened, so a misconfiguration never leaves the domain with no passing
// mechanism at all.
function unmetPrereqs(item, plan, live) {
  return (item.after || []).filter((dep) => {
    const d = plan.items.find((i) => i.id === dep)
    return !d || resolve(d, live).state !== 'applied'
  })
}

const MARK = { applied: 'DONE   ', change: 'CHANGE ', create: 'CREATE ', blocked: 'BLOCKED', conflict: 'CONFLICT' }

async function plan(fromFile) {
  const p = loadPlan()
  // --from lets anyone review the diff against a committed backup without a PAT
  const live = fromFile
    ? JSON.parse(readFileSync(isAbsolute(fromFile) ? fromFile : join(root, fromFile), 'utf-8')).records
    : await listRecords()
  if (fromFile) console.log(`\nOFFLINE diff against ${fromFile}. This may be stale.`)
  console.log(`\n${ZONE}: ${live.length} live records\n`)
  console.log('DRY RUN. Nothing below has been written.\n')
  const ready = []
  for (const item of p.items) {
    const r = resolve(item, live)
    console.log(`[${MARK[r.state]}] #${item.id}  ${item.action} ${item.type} ${item.name}`)
    console.log(`            ${item.why}`)
    if (item.blockedOn) console.log(`      PREREQ: ${item.blockedOn}`)
    if (r.target) console.log(`      from: ${r.target.data}`)
    if (r.state === 'blocked') console.log(`        to: BLOCKED`)
    else if (r.state === 'conflict') console.log(`            ${r.why}`)
    else if (r.state !== 'applied') console.log(`        to: ${item.data}`)
    if (r.state === 'change' || r.state === 'create') {
      const unmet = unmetPrereqs(item, p, live)
      if (unmet.length) console.log(`     ORDER: apply item ${unmet.join(', ')} first, or pass --out-of-order`)
      ready.push(item.id)
    }
    console.log()
  }
  if (p.reserved) {
    console.log('Reserved ids:')
    for (const [k, v] of Object.entries(p.reserved)) console.log(`  ${k}  ${v}`)
    console.log()
  }
  if (ready.length) {
    console.log(`Ready to apply: ${ready.join(', ')}`)
    console.log(`Apply one at a time:  node scripts/godaddy-dns.mjs apply ${ready[0]} --confirm`)
  } else {
    console.log('Nothing ready to apply.')
  }
}

// -------------------------------------------------------------------- apply

async function doh(name, type) {
  const res = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(name)}&type=${type}`, {
    headers: { Accept: 'application/dns-json' },
  })
  const j = await res.json()
  // TXT answers arrive quoted, and long values arrive as several quoted chunks
  return (j.Answer || []).map((a) => String(a.data).replace(/"\s*"/g, '').replace(/"/g, ''))
}

async function waitForPropagation(item) {
  const fqdn = item.name === '@' ? ZONE : `${item.name}.${ZONE}`
  const type = String(item.type).toUpperCase()
  const expect = item.expect && item.expect.length ? item.expect : [String(item.data)]
  const absent = item.absent || []
  const deadline = Date.now() + 10 * 60 * 1000
  process.stdout.write(`Waiting for ${type} ${fqdn} to propagate `)
  while (Date.now() < deadline) {
    const answers = await doh(fqdn, type)
    const joined = answers.join('\n')
    const hasAll = expect.every((e) => joined.includes(e))
    const hasNone = absent.every((a) => !joined.includes(a))
    if (hasAll && hasNone) {
      console.log('\nPropagated.')
      for (const a of answers) console.log(`  ${a}`)
      return true
    }
    process.stdout.write('.')
    await new Promise((r) => setTimeout(r, 15000))
  }
  console.log('\nTimed out after 10 minutes. The write succeeded but resolvers have not caught up.')
  console.log('Re-check with: bash scripts/verify-dns.sh')
  return false
}

async function apply(rawId, confirm) {
  const id = Number(rawId)
  if (!Number.isInteger(id)) die('apply needs a plan item id, for example: apply 1 --confirm')
  if (!confirm) die('apply needs --confirm. Run "plan" first and read the diff.')

  if (!existsSync(backupPath())) {
    die(`no zone backup for today. Run "node scripts/godaddy-dns.mjs backup" and commit ${backupPath().replace(root + '/', '')} first.`)
  }

  const p = loadPlan()
  const item = p.items.find((i) => i.id === id)
  if (!item) die(`plan item ${id} not found in dns-plan.json`)
  assertSafe(item, null)

  const live = await listRecords()
  const r = resolve(item, live)
  assertSafe(item, r.target)

  if (r.state === 'applied') { console.log(`Item ${id} is already live. Nothing to do.`); return }
  if (r.state === 'blocked') die(`item ${id} is blocked on ${item.blockedOn}`)
  if (r.state === 'conflict') die(`item ${id}: ${r.why}`)

  // second snapshot immediately before the write, so a bad apply is one file away
  const unmet = unmetPrereqs(item, p, live)
  if (unmet.length && !process.argv.includes('--out-of-order')) {
    die(`item ${id} should follow item ${unmet.join(', ')}, which is not live yet. Pass --out-of-order to override.`)
  }
  if (item.blockedOn) console.log(`PREREQ: ${item.blockedOn}\n`)

  const pre = join(root, 'docs', `dns-backup-${stamp()}-pre-item${id}.json`)
  writeFileSync(pre, JSON.stringify({ zone: ZONE, takenAt: new Date().toISOString(), item: id, records: live }, null, 2) + '\n')

  const body = { name: item.name, type: item.type, data: item.data, ttl: item.ttl || 3600 }
  if (item.priority != null) body.priority = item.priority

  if (r.state === 'change') {
    console.log(`Replacing ${item.type} ${item.name}`)
    console.log(`  from: ${r.target.data}`)
    console.log(`    to: ${item.data}`)
    await api(`/zones/${ZONE}/dns-records/${encodeURIComponent(r.target.recordId)}`, { method: 'PUT', body })
  } else {
    console.log(`Creating ${item.type} ${item.name}`)
    console.log(`  data: ${item.data}`)
    await api(`/zones/${ZONE}/dns-records`, { method: 'POST', body })
  }
  console.log('Write accepted.\n')
  await waitForPropagation(item)
}

// --------------------------------------------------------------------- main

const [mode, ...rest] = process.argv.slice(2)
const confirm = rest.includes('--confirm')
try {
  if (mode === 'backup') await backup()
  else if (mode === 'plan') await plan(rest.includes('--from') ? rest[rest.indexOf('--from') + 1] : null)
  else if (mode === 'apply') await apply(rest[0], confirm)
  else {
    console.log('Usage:')
    console.log('  node scripts/godaddy-dns.mjs backup')
    console.log('  node scripts/godaddy-dns.mjs plan [--from docs/dns-backup-YYYYMMDD.json]')
    console.log('  node scripts/godaddy-dns.mjs apply <id> --confirm')
    process.exit(1)
  }
} catch (err) {
  console.error(`\nFAILED: ${err.message}\n`)
  process.exit(1)
}
