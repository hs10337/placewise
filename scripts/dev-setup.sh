#!/usr/bin/env bash
set -euo pipefail

checks=(psql supabase swiftformat swiftlint xcodegen)
missing=()
for cmd in "${checks[@]}"; do
  if ! command -v "$cmd" >/dev/null 2>&1; then
    missing+=("$cmd")
  fi
done

if [ ${#missing[@]} -gt 0 ]; then
  echo "Missing tools: ${missing[*]}"
  echo "Install with: brew install postgresql@16 supabase/tap/supabase swiftformat swiftlint xcodegen"
  exit 1
fi

echo "All required CLI tools are installed."
