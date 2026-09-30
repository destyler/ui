# Bounded HoverCard observation

This is an opt-in diagnostic, not a fix for the intermittent uncontrolled-close
assertion in `controllable-migration.test.tsx`.

Run from the repository root:

```sh
pnpm exec vitest run --config packages/react/vitest.hover-card-diagnostic.config.ts --browser.headless --reporter=verbose
```

The dedicated workflow executes this command once on Node 24, where the unchanged
assertion also failed in UI PR 56. It runs four conditions without retries:

| Predecessor | Pointer location before replacement |
| --- | --- |
| Plain trigger | Trigger center |
| Plain trigger | Bottom-right outside target |
| FloatingPanel after its repeated open/close contract | Trigger center |
| FloatingPanel after its repeated open/close contract | Bottom-right outside target |

Each condition removes the predecessor and mounts HoverCard with the original
DOM shape, zero delays, `act` boundary, zero-delay yield, four API requests, and
API/DOM/callback assertions. Pointer placement is an explicit experimental input
only in this opt-in file. No pointer movement is added to the original test.
The production Vite config supplies the unchanged React Compiler options.

Every condition logs its pointer seed, native event chronology, callbacks,
renders, DOM mutations, and raw machine snapshots, including successful cases.
The trace is bounded to 200 entries and reports truncation. The workflow uploads
the log and any screenshots.

## Interpretation and stopping condition

Stop after this single four-condition run and inspect the evidence:

- A trusted pointer/focus event followed by machine reopening and a new open
  callback after the close request supports an input-driven reopen path
- A raw machine snapshot tagged closed while the React API/DOM remains open
  supports a notification/render divergence
- A machine that remains open/closing after CLOSE without new input instead
  points to a machine transition/timer path
- Green results or absent/ambiguous chronology are inconclusive, not a fix

Do not repeatedly rerun until green, change the original assertion or wait, or
apply a pointer relocation workaround without evidence.

## Instrumentation limits

The diagnostic-only alias delegates to the original `useMachine` and returns
its exact tuple. Each condition asserts that the raw HoverCard machine is present,
so an inactive alias or unexpected machine ID fails instead of silently omitting
evidence. It reads `service.getState()` outside render and registers a
separate passive `service.subscribe` listener; it does not read the tracked React
snapshot, call state setters, alter timers, or replace the compiler boundary.
Its layout-effect/subscription and logging overhead can still perturb scheduling.
Therefore a negative result cannot exclude the original race, and any observed
divergence needs confirmation in the original suite before claiming its cause.
This models same-iframe fixture replacement and stationary pointer state; it does
not establish whether cross-file browser iframe reuse caused earlier failures.
