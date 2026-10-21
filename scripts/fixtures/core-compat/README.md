# Exact-core installed Dialog consumers

Regression coverage for [UI #151](https://github.com/destyler/ui/issues/151).
These consumers import installed package artifacts, not workspace aliases.

## Run

Use Node >=22.22.3 and pnpm 10.28.0, then install the workspace lockfile.

- `pnpm test:core-compat /tmp/ui-core-evidence` builds and packs all four current
  packages and verifies each isolated consumer. Use a fresh evidence directory.
- `node scripts/test-core-compat.mjs 0.0.1-beta.17 /tmp/ui-beta17-evidence`
  reproduces the published release, with explicit UI and core versions. This is
  expected to exit nonzero for beta.17, not a passing regression baseline.
- `node scripts/test-core-compat.mjs /path/to/tarballs /tmp/ui-candidate-evidence`
  tests existing packs named by `pnpm pack` (the versions must match the checkout).

The runner pins framework runtimes and core 0.2.13 using npm overrides, checks the
resolved core packages, and retains each consumer's package-lock.json, version
record, lock SHA-256, build/interaction logs, and a combined results.json. A fresh
consumer directory is required. The overrides are a test matrix control, not a
recommended workaround for applications. Registry dist-tags are never used.
Dependency lifecycle scripts are disabled; nothing is published or retagged.

## Contract and limits

Each framework renders Dialog.Root, Trigger, Positioner, Content, Title, and
CloseTrigger. The same interaction assertions cover:

1. Omitted `open`: uncontrolled open/close twice, with change callbacks.
2. `defaultOpen=false`: uncontrolled open/close twice.
3. `defaultOpen=true`: initially open, then close and reopen twice. The default
   must seed state, not become a controlled value.
4. `open=false`: clicking requests `true`, but state remains closed without a
   parent update.

The production Vite bundles run with Happy DOM. This is an installed-component
state regression, not real-browser accessibility, focus, SSR, all-component, or
all-supported-framework-version coverage. Existing browser smoke and packed
consumer suites remain required. An import/build failure is recorded separately
from an interaction failure and does not establish a controlled-state defect.
