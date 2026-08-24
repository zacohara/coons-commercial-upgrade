# v3 Audit: Troubleshooting and Remaining Work

Branch `seo-v3-dns`. Audited 2026-08-23 against the live zone, the live site and
a clean local build.

## 1. Verified state

Checked and confirmed, not assumed:

| Thing | State |
|---|---|
| Live site vs `main` | In sync. Phase 2 pages (`/contact/`, building types) all return 200 |
| Live site vs this branch | DEPLOYED 2026-08-24 (source `f9a5f31`). All 31 production checks pass |
| Build | 46 pre-rendered routes, 48 sitemap urls, 16 feed items, deterministic across two runs |
| Page audit | 48 indexable pages, zero duplicate titles, zero duplicate canonicals, every page has a description and a self-referencing canonical |
| Attribution tests | 22/22 assertions pass (`npm run test:attribution`) |
| IndexNow detection | Verified in both directions: asset-hash churn ignored, content edit caught |
| llms.txt urls | All 19 resolve to a real built page |
| DNS assertions | Site and mail records pass. SPF, DKIM, DMARC fail as expected |
| Zone TTLs | 3600 on the apex TXT set and on `_dmarc` |
| `mail.coonsroofing.com` | Free. NXDOMAIN on A, CNAME and TXT, so the GHL record has nowhere to collide |

## 2. The biggest open risk

**The GoDaddy tool has never made an authenticated call.** The plan logic,
the guardrails and the offline diff are all tested. The API contract came from
the published OpenAPI spec, not from a live response. Everything from `backup`
onward is unproven until a PAT exists.

Diagnose in this order when R1 is done:

1. `node scripts/godaddy-dns.mjs backup`
2. `401` means the token is wrong or expired. `403` means it exists but lacks
   DNS read/write scope. Regenerate rather than guess.
3. `404` on the zone path means the endpoint shape moved again. Re-pull
   `https://developer.godaddy.com/openapi/domains-v3.json` and compare
   `/zones/{zone}/dns-records` against what the tool calls.
4. A backup with far fewer than 14 records means pagination broke. The tool
   pages at 100 per request and stops on `totalPages`.

## 3. Troubleshooting by system

### DNS applies

**Propagation checks will probably time out, and that is not a failure.**
Both records slated for replacement carry a TTL of 3600. `apply` polls for ten
minutes, so a resolver can legitimately still be serving the old value when the
poll gives up. The write already succeeded at that point. Re-run
`bash scripts/verify-dns.sh` an hour later rather than re-applying.

**The PAT expires in 90 days.** Set a reminder now. When it lapses everything
fails with a 401 and the failure looks identical to a scope problem.

**`apply` refuses without a backup taken today.** That is deliberate. Run
`backup` and commit the file.

**A REPLACE that reports `conflict`** means the `match` string hit zero or
several records. The apex holds three TXT records, so `match` is what
disambiguates SPF from the two verification tokens. Never loosen it to make an
apply go through.

### Email authentication

**Order matters and the tool enforces it.** Item 1 (SPF tighten) is gated
behind item 2 (DKIM). Overriding with `--out-of-order` leaves the domain with a
narrowed SPF and no DKIM at the same time, which is worse than where it started.

**DMARC reports bounce if the mailbox does not exist.** R4 (create the
`dmarc-reports@` group) has to land before item 3, or receivers will send
reports to a dead address and some will stop sending entirely.

**Workspace DKIM has a two-stage flow.** Generate the record, wait for the TXT
to resolve, then go back into admin and press Start authentication. Pressing it
early makes Workspace report failure and it is not obvious that the fix is just
to wait.

**Test the result properly.** Send from GHL to a Gmail address, open the
message, Show original, and confirm three passes: SPF, DKIM, DMARC. A GHL
"verified" badge alone does not prove the mail authenticates.

### Attribution

**Safari caps script-set cookies at 7 days.** This is the real limitation and
it cannot be fixed from a static site. `document.cookie` on iOS Safari and
desktop Safari is capped by ITP, so the 90-day first touch is really 7 days for
a large share of mobile traffic. Chrome and Android get the full 90.
Consequence: long consideration cycles on iPhone lose first touch. Fixing it
properly needs a server or edge worker setting the cookie in an HTTP response,
which GitHub Pages cannot do. Worth knowing before anyone builds a report on
90-day windows.

**33 fields now post to the webhook, 20 of them unmapped.** The existing seven
mappings still work and nothing broke. But `ft_utm_source` and friends land
nowhere until R6 creates matching custom fields. Mapping twenty fields by hand
in GHL is miserable. Recommendation: map six that carry the decision
(`ft_utm_source`, `ft_utm_medium`, `ft_utm_campaign`, `ft_landing_path`,
`lt_utm_source`, `page_path`) and ignore the rest, or have me add a single
`attribution_summary` string so it is one field to map instead of twenty.

**If a lead shows no attribution at all**, check in this order: the cookie
exists (`document.cookie` contains `cr_ft`), the field is mapped in the GHL
workflow, the workflow trigger is the current URL. Per the GHL notes, a stale
inbound trigger returns 200 and silently drops everything, so a clean 200 is
not proof of delivery.

**Ad blockers.** `contact_phone` and `generate_lead` ride on gtag and disappear
when it is blocked. The webhook payload does not, because it posts directly. So
GHL will always show more leads than GA4. That gap is expected, not a bug.

### IndexNow

**`docs/url-hashes.json` must be committed after every run.** The script
updates it in the working tree. If it is not committed, the next run sees no
manifest, treats every page as new, and re-submits all 48.

**Run it after deploy, never before.** The endpoint fetches the urls it is
given. Submitting a page that is not live yet wastes the crawl.

**First run records a baseline and submits nothing.** That is intentional. Use
`--all` once, after the first deploy, to seed Bing.

**A non-200/202 response leaves the manifest untouched** so the next run
retries. Do not re-run with `--all` to "force" it.

### AI surface

**VideoObject is the weakest item shipped.** The video facade is a gradient box
with a play button and no poster image, so at crawl time the page has no video
element at all, only the JSON-LD. AI crawlers reading structured data will be
fine. Google video rich results may not validate it. Cheap fix that helps both
the markup and the UI: put a real frame behind the facade instead of the
gradient. Vimeo's own auto-thumbnail is unusable, it is a frame of the logo
animation with the wordmark cropped off.

**llms.txt goes stale silently.** It is hand-written on purpose, because a
generated list of 46 routes is worse for an LLM than ten curated ones. But
nothing enforces it. Re-read it whenever pages are added or the service mix
changes.

## 4. Remaining work

### Blocked on Zac, in order

| # | Task | Blocks |
|---|---|---|
| R1 | GoDaddy PAT, DNS read/write scope | All of Workstream H and I |
| R4 | Create `dmarc-reports@coonsroofing.com` group | Plan item 3 |
| R3 | Workspace DKIM generate, then Start authentication after propagation | Plan items 2 then 1 |
| R2 | Search Console and Google estate inventory as Wade | Workstream J, and it may hold historical query data |
| R5 | GHL dedicated sending domain | Plan item 4, and all GHL email sending |
| R6 | GHL custom fields and webhook mapping | Attribution actually landing anywhere |
| GA4 | Mark `generate_lead` and `contact_phone` as key events | Ads conversion import later |

Note on the GA4 step: the spec calls the event `phone_click`. The site has been
firing `contact_phone` since the Phase 2 work. Mark that one. Do not create
`phone_click`.

### Code work: done and deployed 2026-08-24

**Privacy policy.** Cookies and Tracking section added, separating analytics
from attribution, stating what the attribution cookie holds, for how long, and
that it carries no name, email or phone. Texas privacy rights added. Every A2P
clause verified still present.

**Sitemap `lastmod`.** No longer hardcoded. `docs/page-dates.json` stores a
content fingerprint per url and the date it last changed. Seeded by diffing the
build against live production, so the first sitemap moved exactly three pages
and left 45 on 2026-08-02.

**Video poster.** A real crew photo now sits behind the play button, at two
widths with srcset, and `VideoObject.thumbnailUrl` points at it. A true frame
from the video could not be obtained: Vimeo 403s the player config endpoint and
headless Chrome will not advance video decode under a virtual time budget.

**Marquee hydration bug.** Fixed and live. Production no longer serves a random
animation name.

**IndexNow.** All 48 live urls submitted and accepted (HTTP 202). The manifest
is the baseline for future diffs.

### Code work, unblocked, still open

**Twelve of sixteen blog posts have no real publish date.** They fall back to
2026-03-15 in both the schema and the feed. Wade or the git history can supply
real dates. Now slightly more visible than before, because those dates show in
the RSS feed.

**Deploy is still a manual force-push.** It worked, and it is documented, but
every step (build, CNAME, gh-pages push, IndexNow submit, manifest commit) is
done by hand and in the right order or the deploy is wrong. L.4 in the spec
wants that as one workflow. The post-deploy smoke test written for this deploy
(31 url assertions) is most of `verify-live.sh` already and should be committed
into the repo when L.1 is built.

**No `og:image` dimensions for the new poster.** Not a regression, the site
still uses `og-default.jpg` for social cards. Only noted so nobody assumes the
video poster doubles as a share image.

### Spec items that reference things this repo does not have

`K.5`, `L.1`, `L.2`, `L.3` and `J.1` reconciliation all depend on v2 artifacts:
Workstream E content, `verify-live.sh`, `audit-links.mjs`, the B.1 stub table.
None exist here and there is no v2 document. `verify-live.sh` and
`audit-links.mjs` are straightforward to write from scratch, at which point the
whole L workstream falls out. The page audit already run for this document is
most of `audit-links.mjs` already.

### Deliberately not done

- `M.5` DNI. Spec defers it until tracking numbers exist.
- `I.5` staged DMARC enforcement. Needs 2 to 4 weeks of clean rua reports first.
- `R7` cold outreach domains. Post-launch, and must not send from the primary
  domain.
