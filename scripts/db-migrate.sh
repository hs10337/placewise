#!/usr/bin/env bash
set -euo pipefail

if ! command -v psql >/dev/null 2>&1; then
  echo "psql is required"
  exit 1
fi

DB_URL="${DB_URL:-postgresql://postgres:postgres@127.0.0.1:54322/postgres}"

for f in backend/sql/001_extensions.sql backend/sql/002_schema.sql backend/sql/003_resolution_fn.sql; do
  echo "Applying $f"
  psql "$DB_URL" -v ON_ERROR_STOP=1 -f "$f"
done

echo "Migrations applied."
