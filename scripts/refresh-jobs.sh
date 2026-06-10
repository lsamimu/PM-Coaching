#!/usr/bin/env bash
# Refresh website/src/data/jobs.json from the latest crawl.
# Usage: ./scripts/refresh-jobs.sh
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [[ ! -x .venv/bin/python ]]; then
  echo "Missing .venv — run: python3 -m venv .venv && .venv/bin/pip install -r requirements.txt"
  exit 1
fi

.venv/bin/python execution/run_pipeline.py --no-email
echo ""
echo "Updated: website/src/data/jobs.json"
echo "Next: git commit the file and deploy the website."
