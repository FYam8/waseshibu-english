#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PORT="${WASEDA_TEST_PORT:-8765}"
TMP="$(mktemp -d)"
SERVER_LOG="$TMP/server.log"
DOM="$TMP/dom.html"

cleanup(){
  if [[ -n "${SERVER_PID:-}" ]]; then kill "$SERVER_PID" 2>/dev/null || true; fi
  rm -rf "$TMP"
}
trap cleanup EXIT

cd "$ROOT"
python3 -m http.server "$PORT" --bind 127.0.0.1 >"$SERVER_LOG" 2>&1 &
SERVER_PID=$!

for _ in {1..30}; do
  if curl -fsS "http://127.0.0.1:$PORT/tests/waseda-browser-smoke.html" >/dev/null; then break; fi
  sleep 0.2
done
curl -fsS "http://127.0.0.1:$PORT/tests/waseda-browser-smoke.html" >/dev/null

CHROME="$(command -v google-chrome || command -v chromium || command -v chromium-browser || true)"
if [[ -z "$CHROME" ]]; then
  echo "Chrome/Chromium not available on runner" >&2
  exit 1
fi

"$CHROME" --headless=new --no-sandbox --disable-gpu --disable-dev-shm-usage \
  --user-data-dir="$TMP/profile" --virtual-time-budget=5000 --dump-dom \
  "http://127.0.0.1:$PORT/tests/waseda-browser-smoke.html" >"$DOM" 2>"$TMP/chrome.log"

if ! grep -q 'data-test-result="CLEAN"' "$DOM"; then
  echo "Waseda browser characterization failed" >&2
  grep -o 'Waseda browser baseline: FAIL:[^<]*' "$DOM" >&2 || true
  cat "$TMP/chrome.log" >&2 || true
  exit 1
fi

echo "Waseda real-browser baseline: CLEAN"
