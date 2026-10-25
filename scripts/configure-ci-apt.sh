#!/usr/bin/env bash
# The optional apt directory lets offline tests exercise runner layout changes.
# CI invokes this helper under sudo; no package installation happens here.
set -euo pipefail

apt_dir="${1:-/etc/apt}"
mirror_list="$apt_dir/apt-mirrors.txt"
azure_mirror='https?://azure\.archive\.ubuntu\.com/ubuntu(/|[[:space:]]|$)'

printf '%s\n' 'Acquire::http::Timeout "30";' 'Acquire::https::Timeout "30";' 'Acquire::Retries "2";' > "$apt_dir/apt.conf.d/99-ci-downloads"
echo 'CI apt download limits:'
cat "$apt_dir/apt.conf.d/99-ci-downloads"

if [ ! -f "$mirror_list" ]; then
  echo "No apt mirror list at $mirror_list; leaving runner sources unchanged."
  exit 0
fi

if grep -Eq "$azure_mirror" "$mirror_list"; then
  sed -i -E "s#$azure_mirror#https://archive.ubuntu.com/ubuntu\1#g" "$mirror_list"
  echo 'Replaced Azure Ubuntu mirror with the official HTTPS mirror.'
else
  echo 'No matching Azure Ubuntu mirror; leaving runner mirror list unchanged.'
fi
echo "Effective apt mirror list ($mirror_list):"
cat "$mirror_list"
