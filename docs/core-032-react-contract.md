# React migration to core 0.3.2

This note records the UI source audit and focused validation on 2026-10-31,
starting from UI main `2c7c0ba` and core `v0.3.2` (`53200b44`). It is not a
release announcement or a claim that all supported environments have passed.
The core catalog minimum and the installed-artifact compatibility gate now
require 0.3.2. Previously published UI artifacts are unchanged.

## Contract change

[Core #362](https://github.com/destyler/destyler/pull/362) replaces implicit
property-read tracking in React `useMachine` / `useActor` with subscription to
every changed immutable snapshot. An unchanged snapshot retains its reference;
unchanged nested data retains structural sharing. Render-time property reads,
including those skipped by the React Compiler, no longer determine updates.

Core also exposes `useService` for lifecycle without snapshot subscription and
`useSelector` for explicit selection/equality. Adding a selector beside an
existing `useMachine` subscription does not narrow that existing subscription.
UI does not convert its entire public context API to selectors in this change.

The important migration rule is to avoid treating a complete snapshot or a
freshly connected API object as a semantic effect dependency. An effect that
writes an event can itself trigger the next snapshot notification.

## Reproduced UI impact

The controlled A/B used the actual UI source, React 19.3.0, Happy DOM and the
React Compiler targeting React 18. Component machines were held at core 0.3.2;
only the React adapter switched between published 0.3.1 and 0.3.2. This isolates
adapter behavior, rather than representing a complete old-core installation.
Tour and FileUpload machine sources were unchanged between the two tags, as
were the relevant store/xstate implementation sources. The installed old/new
store bundles were byte-identical.

| Actual UI path / operation | Adapter 0.3.1 | Adapter 0.3.2 before fixes |
| --- | --- | --- |
| `useTour` with the Basic example's whole-API effect calling `start()` | Settled after 4 starts | Reached the fixture's 8-start protection limit; 10 effects/renders |
| `ItemPreviewImage`, same File, three `openFilePicker()` metadata events | 0 additional object URLs | 3 additional URLs and 3 additional revocations |

The A/B logs contained the expected assertion failures, not additional unhandled
errors. The Tour probe deliberately bounds writes: it demonstrates feedback
retriggering, not an observed unbounded browser hang. The preview probe counts
URL creation/revocation; it does not demonstrate a leak, visible flicker or
image-loading behavior. Its observation host opts out of compilation, while the
actual UI components retain compilation.

### Corrections

- **Shared `hooks/use-machine.ts`:** return the core result without spreading
  the snapshot. The old workaround manufactured a different root object on
  prop-only renders, defeating the new stable-reference contract. Remove its
  obsolete read-tracking explanation and compiler opt-out as well.
- **Tour Basic:** wrap `tour.start` in the existing stable `useEvent` helper and
  make the startup effect depend on that command, not the entire connected API.
  The command still calls the latest implementation.
- **FileUpload preview:** make URL creation stable for the owning window and
  key the resource effect to the actual File and creation function. A window
  change still invalidates the resource; cleanup revokes the URL using the
  window that created it. Public calls resolve the latest root getter at call
  time, including changes without a render. Do not retain an old snapshot's
  environment closure.

The shared-hook regression was run red then green: the old clone failed
reference equality after a prop-only render; the fix preserves snapshot, send
and service identities while still receiving metadata-only and context updates,
without requiring snapshot field reads during render.

The final Tour regression mounts the actual Basic example, covers ordinary and
StrictMode mounts, and checks that dismissal stays closed. Its instrumentation
wraps the real hook with a counted/bounded `start` and creates an extra API
object. That is useful regression protection, but the unmocked A/B above—not
this instrumentation alone—is the evidence attributing the change to #362.

## Existing boundaries that should be preserved

Full subscription does not mean every context synchronization becomes a loop.
Core's prop-to-context synchronization still checks deep equality before writing.
UI Select, Combobox and Tree collection effects depend on `collection`, not the
entire snapshot/API. Presence already uses stable `useEvent` and
`[service, setNode]` dependencies. Menu registration and ScrollArea default-scroll
initialization use mount-only effects. Native-input reconciliation drains its
pending queue and consults live service state. Static review found no new defect
in these boundaries; this is not a claim of complete browser validation.

Keep the existing controlled-value guards: omitted values must
not accidentally become controlled or overwrite machine-owned state. These
source-level safeguards are not a guarantee that all possible consumer effects
are safe.

Do not replace existing guards with whole-API effect dependencies, suppress
notifications globally, or compare an entire connected API solely by its value
array. Connected handlers also capture focus, disabled state, translations,
ARIA state and environment information.

## Performance risks, not measured regressions

Signature, Slider, OTP, Carousel, Timer and Toast place broad connected APIs in
ordinary React contexts. More snapshot notifications can propagate to context
consumers; pointer movement and timer ticks deserve particular attention.
Signature and Timer import the core hook directly, so the shared-wrapper fix
alone does not narrow their subscriptions.

This audit has not measured a UI-wide render multiplier, CPU regression or
memory regression. The previous spreading wrapper already observed enumerable
root metadata through the old proxy, so not every metadata notification is new.
Carousel's `Array.from(pageSnapPoints)` allocation also predates 0.3.2.

If profiling justifies narrower boundaries, compare old adapter + original UI,
new adapter + original UI, and new adapter + fixed UI. Count renders and commits
separately, preserve all consumed selector dependencies, and test public API and
context compatibility before changing architecture. Core benchmark ratios are
not measurements of these UI components.

## Validation snapshot and remaining gates

Focused checks so far:

- React 19.3.0: the three new regression files pass 8 tests (Tour 2, FileUpload 5,
  shared hook 1); all 11 original React SSR files pass 87 tests.
- React 18.0.0: the same 8 new regression tests pass, plus the original FileUpload
  SSR test (1).
- React 19 controlled-state migration: 153 tests pass under Happy DOM. Browser-
  specific branches are skipped there; this is not 153 browser-test passes.

These run against installed core 0.3.2 and actual UI source, not the unrelated
older installed workspace. They do not replace the full repository suite or
installed public artifacts.

The fresh frozen workspace install passed with pnpm 10.28.0. All four framework
source type checks passed. Actual repository SSR checks passed 487 tests
(React 87, Vue 168, Solid 90, Svelte 142), and Vue unit checks passed 263 tests.
On Node 22.22.3 the final React targeted run passed 165 tests: 8 new regressions,
153 controlled-state migration tests and 4 existing environment-boundary tests;
the 87 React SSR tests also passed again. These remain simulated-DOM/Node checks.
The lockfile was generated by pnpm, not manually edited: besides core upgrades,
it re-resolved existing non-core peer snapshots without changing their package
versions or integrity entries. The fresh frozen install verifies consistency.

Full workspace lint passed with 0 errors and 667 warnings. The final Node-floor
packed-consumer matrix also passed: all four packages built, packed and installed
into isolated consumers, 52 interaction cases passed, and every resolved core
package was verified as 0.3.2. Its runner unit tests passed 14 cases.
The separate React packed-consumer gate also passed on Node 22.22.3 for React
18.0.0 and 19.3.0: imports, Bundler/NodeNext types, SSR, and simulated-DOM
hydration/interactions. Its declaration-transform unit tests passed 4 cases.

Real-browser and Storybook verification has not completed. Do not infer Chromium/Firefox/WebKit interaction, focus, layout,
accessibility, hydration or browser resource behavior from Happy DOM/SSR passes.
The complete lint, type, framework, packed-consumer and browser gates remain
required for a release; see the [compatibility checklist](core-compatibility-release.md).
