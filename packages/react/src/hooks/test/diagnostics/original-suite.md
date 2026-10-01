# Original-suite HoverCard failure capture

This is a diagnostic follow-up to the completed predecessor observation. It
does not change production code or claim to fix the intermittent uncontrolled
HoverCard close assertion. The pinned `@destyler/hover-card` is now 0.2.10, including the separate
core API-interruption fix. That fix has not been linked to the original CI
failure by a complete failing trace; its root cause remains unproven.

## What changes when enabled

Set `HOVER_CARD_RAW_TRACE=1` for the normal monorepo `pnpm run test:ci` command.
The React test configuration then places an exact-match diagnostic alias before
the normal `~/` alias. It delegates to the production `useMachine` and returns
the original tuple unchanged. It does not add a state subscription, change the
compiler settings, or read the tracked React snapshot.

Only the original uncontrolled HoverCard test opens a capture scope. A layout
effect registers the actual mounted machine, unmount releases it, and `finally`
clears the scope. SSR and other tests do not start a capture. The test asserts
that exactly one matching machine was registered before using its API.

The existing native pointer/focus recorder starts before mount. Direct
`service.getState()` checkpoints are added immediately before and after the
unchanged `api.setOpen` call, after the existing `act` completes, at the first
API/DOM mismatch per request, and on failure. Each checkpoint serializes a copy
of value, tags, current/previous event, relevant context and machine identity.
Undefined fields become null. Uncontrolled `context.open` is not interpreted
as the machine's visibility; use value and tags.

No pointer relocation, event injection, frame wait, timeout increase, compiler
opt-out or retry is added. Original API/DOM/callback assertions and their waits
are preserved. Failure output keeps the existing prefix and is bounded to 200
entries; truncation is reported. Successful test runs do not print the trace.
Only after all four original iterations pass, Vitest task metadata records a
small coverage marker proving the alias captured an actual machine. The JSON
reporter retains this marker, which is required before another observation can
start. A disabled flag or missing alias is never treated as a negative finding.
The infrastructure `.probe.tsx` file is excluded from normal test discovery.

## Current diagnostic branch

The ordinary Node 20/22/24 aggregate CI enables `HOVER_CARD_RAW_TRACE=1` for
this diagnostic PR, after the original close failure recurred on core 0.2.10.
It retains the normal complete suite, sequencing and assertions. This is one
fresh three-node observation, not a retry-until-green policy. Stop after
inspecting its results; passes are inconclusive. The dedicated manual workflow
below remains separate. Remove diagnostic CI activation when this investigation
is retired rather than presenting it as a production fix.

## Budget and stopping rule

The diagnostic workflow is manual-only (`workflow_dispatch`); normal PR
updates run the ordinary aggregate CI without automatically spending another
three full-suite observation budget. Once the workflow is on the default
branch, dispatch it explicitly for the branch under investigation.

Each manual run performs at most three sequential, fresh Node 22 CI
observations. Each uses a new checkout with the pinned dependency installation,
the full normal test suite and its default sequencing, no file parallelism and
zero retries. It does not select only this file or impose a new file order.
Fresh jobs avoid Vitest's result cache changing the next observation's order by
prior duration or failures. Full logs and the JSON test report retain the
executed files and outcomes for review.

Stop after the first complete original close-failure trace. Missing or
truncated capture and infrastructure failure also stop the sequence rather
than silently consuming more attempts. A completed suite with unrelated
assertion failures can continue only if the target passed with a valid capture
marker and no infrastructure or unhandled errors were reported. Preserve every
suite exit status: capturing an expected failure must still leave that CI
observation failed. Archive logs, JSON results, classification and available
screenshots for every observation, including passes. Three observations without
the target failure are inconclusive and end this experiment; unrelated failures
remain failed. Do not rerun until green or claim a fix.

A complete target trace must belong to the original uncontrolled React
HoverCard test, fail its state assertion for a false request, have no dropped
entries, and contain ordered before-action, after-action, after-act,
first-mismatch and failure snapshots for that request and the same actual
machine. Absence of pointer/focus events is valid evidence, so a complete trace
does not require such an event to have occurred.

## Interpretation

- Raw closed immediately after CLOSE, then a newer native pointer/focus event,
  open callback and raw open state supports an input-driven reopen
- Raw closed at failure while React API/DOM remains open supports a
  notification/render divergence
- Raw `closing` before CLOSE, with no immediate transition, can expose the
  published machine's missing CLOSE transition; only an original failing trace
  can link the separate core fix to this failure
- Raw open/closing retained without newer input points to an API dispatch,
  transition or timer path and needs examination of all checkpoints
- A passing observation establishes none of these explanations

The raw machine event field is the latest event, not a complete transition log.
The UI's `useEvent(..., { sync: true })` actually defers callbacks to a microtask,
and `service.subscribe` also batches notifications in a microtask. Direct
checkpoints avoid treating those logs as synchronous transition boundaries.
Document event capture runs before React's event handler. Diagnostic copying
and the added layout effect can still affect scheduling; even a captured
divergence requires interpretation in that context.

## Local validation without a browser launch

From the repository root, using the installed pinned project executables:

```sh
pnpm --filter @destyler-ui/react exec env HOVER_CARD_RAW_TRACE=1 vitest run --config vitest.hover-card-trace-unit.config.ts
node_modules/.bin/tsc -p packages/react/tsconfig.json --noEmit
node --test scripts/hover-card-diagnostic.test.mjs
```

The explicit happy-dom configuration keeps the production React Compiler,
runs the original 127 migration contracts and existing recorder tests, and
checks raw capture scoping, detached values, ambiguous mounts, SSR and unmount
cleanup. It cannot establish native Chromium pointer scheduling. Browser
observations remain limited to the authorized CI budget.

The Node classifier tests separately verify complete versus incomplete capture,
success-marker requirements, unrelated assertions, skipped tests, infrastructure
errors, the observation limit, and retention of a nonzero suite status.
