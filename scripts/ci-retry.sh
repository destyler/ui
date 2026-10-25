#!/usr/bin/env bash
# Retry an installation command once; never wrap test commands with this helper.
# The caller supplies timeout so privileged children can also be terminated.
set -euo pipefail

if [ "$#" -eq 0 ]; then
  echo "Usage: ci-retry.sh <bounded installation command> [args...]" >&2
  exit 2
fi

for attempt in 1 2; do
  if "$@"; then
    exit 0
  else
    status=$?
  fi
  echo "Installation attempt $attempt/2 failed (exit $status)." >&2
  if [ "$attempt" -eq 1 ]; then
    sleep 10
  fi
done

echo "Installation failed after two attempts; refusing to continue." >&2
exit "$status"
