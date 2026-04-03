#!/usr/bin/env bash
set -euo pipefail

if ! command -v psql >/dev/null 2>&1; then
  echo "psql is required"
  exit 1
fi

DB_URL="${DB_URL:-postgresql://postgres:postgres@127.0.0.1:54322/postgres}"

echo "Applying backend/seeds/san-francisco.sample.sql"
psql "$DB_URL" -v ON_ERROR_STOP=1 -f backend/seeds/san-francisco.sample.sql
echo "Seed applied."
