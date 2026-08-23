#!/usr/bin/env bash
# Live DNS assertions for coonsroofing.com, resolved over DNS-over-HTTPS so the
# answer comes from Google's public resolver and not the local cache.
#
#   bash scripts/verify-dns.sh
#
# Exits non-zero if any assertion fails, so CI can gate on it.
set -uo pipefail

ZONE="coonsroofing.com"
FAIL=0

q() {
  curl -s --max-time 15 "https://dns.google/resolve?name=$1&type=$2" | python3 -c "
import sys,json
try: a=json.load(sys.stdin).get('Answer',[])
except Exception: a=[]
print('\n'.join(x['data'].replace('\" \"','').replace('\"','') for x in a) if a else 'MISSING')"
}

# check <label> <name> <type> <required-substring> [forbidden-substring]
check() {
  local label="$1" name="$2" type="$3" want="$4" forbid="${5:-}"
  local got
  got="$(q "$name" "$type")"
  if [ "$got" = "MISSING" ]; then
    printf '  FAIL  %-22s no %s record at %s\n' "$label" "$type" "$name"
    FAIL=1; return
  fi
  if ! grep -qF -- "$want" <<<"$got"; then
    printf '  FAIL  %-22s expected to contain "%s"\n' "$label" "$want"
    sed 's/^/          got: /' <<<"$got"
    FAIL=1; return
  fi
  if [ -n "$forbid" ] && grep -qF -- "$forbid" <<<"$got"; then
    printf '  FAIL  %-22s still contains "%s"\n' "$label" "$forbid"
    sed 's/^/          got: /' <<<"$got"
    FAIL=1; return
  fi
  printf '  ok    %-22s %s\n' "$label" "$(head -1 <<<"$got")"
}

echo "DNS assertions for $ZONE"
echo
echo "Site (must never change):"
check "apex A"       "$ZONE"                  A     "185.199."
check "www CNAME"    "www.$ZONE"              CNAME "zacohara.github.io"
echo
echo "Mail routing (must never change):"
check "MX"           "$ZONE"                  MX    "aspmx.l.google.com"
echo
echo "Email authentication:"
check "SPF"          "$ZONE"                  TXT   "include:_spf.google.com" "v=spf1 a include"
check "DKIM"         "google._domainkey.$ZONE" TXT  "v=DKIM1"
check "DMARC"        "_dmarc.$ZONE"           TXT   "rua=mailto:"
echo

if [ "$FAIL" -ne 0 ]; then
  echo "FAILED. See scripts/godaddy-dns.mjs and dns-plan.json for the remaining work."
  exit 1
fi
echo "All DNS assertions passed."
