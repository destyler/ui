# Bounded Presence package regression gate

This test-only gate validates core PR137 at exactly
`691bcbd43030ba4db4980a8d910e032a947ce01e` against the Solid Tour consumer
based on UI PR61 (`957dd2f68de7ed6cb0431822ddc3d84479c311bc`). It does not
publish, merge, upgrade production dependencies, or substitute source aliases.

## Required evidence

The dedicated `Presence artifact Chromium` workflow runs on its own PR paths
or manual dispatch. Use a test-only draft targeting PR61's branch; there is no
need to run an extra ordinary main-targeted matrix for this diagnostic scope.

1. Install the unchanged UI registry lock with `pnpm install --frozen-lockfile`.
2. In real Chromium, require the published Presence **0.2.9** to fail the
   same-frame backdrop-retention assertion with `PRESENCE_EARLY_EXIT`.
   Additional negative failures are allowed only at the named regression
   assertions. Infrastructure errors, skipped tests, hooks, unhandled errors,
   and interrupted runs invalidate the control. A supplementary reporter reads
   the real Vitest runner outcome because its standard JSON omits unhandled errors.
3. Check out the pinned core SHA, verify the reviewed machine/test Git blobs,
   install frozen core dependencies, and build the actual Presence package and
   its dependencies with their own build scripts. Pack with pnpm. Record the
   SHA256/SHA512 archive identity and verify built/packed entry bytes match.
4. Create a separate UI checkout. Only its Solid Presence dependency uses the
   tarball. Generate its isolated lock by preserving the published lock's graph
   and adding the tarball resolution/integrity plus the identical validated
   Presence dependency snapshot. Compare the entire lock, including importers
   and catalogs, excluding only exact Presence entries. Require pnpm's frozen
   offline installer to accept it without rewriting the lock. Verify installed
   package manifest and entry bytes against the actual archive.
5. In real Chromium, require all three deterministic probes **and all 18
   unchanged original Solid Tour tests** to pass. Retries are disabled.
6. Upload identities, candidate consumer manifest/lock, complete logs, JSON
   assertion reports, supplemental runner reports, and the packed artifact.
   Verify the original production manifests and lock are unchanged.

The probes retain all assertions from the original content-exit regression and
add reopening before the first sample plus reopening/reclosing during an
already suspended exit. RAF delivery is controlled to select the race reliably;
DOM and computed styles are real Chromium. Animation events are dispatched
explicitly, as in the existing test. This is package-boundary/lifecycle evidence,
not native animation timing, screenshots, or visual QA.

The `*.probe.tsx` file is outside normal Vitest discovery. Only explicitly
selecting `vitest.presence-artifact.config.ts` runs the diagnostic fixture.
Existing Tour tests and standard configs remain unchanged.

## Non-browser checks

From the UI root:

```sh
pnpm exec eslint scripts/presence-artifact packages/solid/test-artifact packages/solid/*presence-artifact* .github/workflows/presence-artifact.yml
pnpm --dir packages/solid exec tsc --noEmit --project tsconfig.presence-artifact.json
node --test scripts/presence-artifact/contracts.test.mjs
node scripts/presence-artifact/reporter-fixtures.mjs
```

The last command launches Node Vitest fixtures only. It establishes that a
marked negative assertion is accepted while the same assertion plus real
hook, suite, or unhandled errors is rejected. These checks do not substitute
for a successful Chromium workflow.

## Retirement after a fixed registry release

This is intentionally a bounded **0.2.9 negative-control** gate. Do not merge it
into production merely to make PR61 green, change the negative expectation to a
pass, or point the normal UI catalog at the diagnostic tarball. After an
authorized core release, update PR61 through its normal registry dependency
path and run its full checks. Promote the lifecycle regressions into the normal
suite with the released package, then close/retire this diagnostic draft or
adapt it explicitly to separate frozen old/new registry consumers. The gate
fails closed if its pinned 0.2.9 or core identity assumptions stop applying.
