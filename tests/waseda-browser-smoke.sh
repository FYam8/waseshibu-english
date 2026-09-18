#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PORT="${WASEDA_TEST_PORT:-8765}"
TMP="$(mktemp -d)"
SERVER_LOG="$TMP/server.log"

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

for scenario in fresh attempt drill drill-legacy-choice future; do
  DOM="$TMP/dom-$scenario.html"
  LOG="$TMP/chrome-$scenario.log"
  PROFILE="$TMP/profile-$scenario"
  "$CHROME" --headless=new --no-sandbox --disable-gpu --disable-dev-shm-usage \
    --user-data-dir="$PROFILE" --virtual-time-budget=5000 --dump-dom \
    "http://127.0.0.1:$PORT/tests/waseda-browser-smoke.html?case=$scenario" >"$DOM" 2>"$LOG"
  if ! grep -q 'data-test-result="CLEAN"' "$DOM"; then
    echo "Waseda browser characterization failed: $scenario" >&2
    grep -o 'Waseda browser baseline: FAIL:[^<]*' "$DOM" >&2 || true
    cat "$LOG" >&2 || true
    exit 1
  fi
  echo "Waseda browser baseline $scenario: CLEAN"
done

echo "Waseda real-browser baseline: CLEAN"
