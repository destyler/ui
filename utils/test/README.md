# Shared UI behavior contracts

`behavior-contracts.ts` shares **scenario descriptions and assertions**, not a
renderer. React keeps `act` and its compiler-enabled hook harness, Vue keeps its
Root/hook/RootProvider fixture, Solid keeps accessors and testing-library, and
Svelte mounts its existing binding fixture through the native Svelte runtime.
The framework suites still own DOM events, prop updates, settling and cleanup.

## Executable shared scope

The same three ownership scenarios run for these eight fields in every runtime:

- Checkbox.checked
- NumberInput.value
- Combobox.value and inputValue
- Dialog.open
- Calendar.value
- Tree.selectedValue and expandedValue

The scenarios assert public API state, rendered state, and the **entire ordered
change-notification history** after each action. They cover an explicitly
undefined live prop, mount-only defaults, unrelated rerenders, live-over-default
precedence, repeated vetoes, delayed parent writeback, and two accepted cycles.
Parent writes and later defaults must not produce extra change notifications.
Coverage assertions prevent the framework field lists from silently drifting.

Runtime entry points:

| Runtime | Ownership scenarios | Additional shared assertions |
| --- | --- | --- |
| React | `packages/react/src/hooks/test/controllable-migration.test.tsx` (hooks) | Dialog focus/disposal; native Checkbox reset through Root/provider/hook; existing NumberInput/Edit composition and caret cases |
| Vue | `packages/vue/src/test/controllable-migration.test.ts` (Root/provider/hook) | Dialog focus/disposal; accepted NumberInput partial text/caret; native Checkbox reset through Root/provider/hook |
| Solid | `packages/solid/tests/shared-behavior-contract.test.tsx` (hooks) | Dialog focus/disposal; native Checkbox reset through Root/provider/hook in `native-input-control.test.tsx` |
| Svelte | `packages/svelte/tests/migration/shared-behavior-contract.test.ts` (Root) | Dialog focus/disposal; native Checkbox reset; existing composition/caret assertions in `native-input.test.ts` |

The Dialog lifecycle cases open and dismiss twice (including Escape), verify
focus returns to the same mounted trigger, then unmount while open and verify a
later document Escape does not emit another request. Each case also scopes a
`keydown` listener tracker to its own document after the closed fixture mounts.
It requires live registrations on every open and matching listener-identity and
capture removals after both closes and open-state unmount. Callback silence
alone is insufficient: a leaked listener can become inert when the machine stops.
The tracker restores its spies and any remaining registrations in `finally`, so
it does not depend on global cross-test listener counts. It observes explicit
add/remove pairs; it is not a general census of once/AbortSignal listeners.
Checkbox reset checks the
native property, API state and successful form values through two reset cycles.
Vue, Solid and Svelte additionally change a later default before resetting;
React already tests that boundary in its Checkbox component suite.

## Deliberate boundaries

- UI `undefined` is omitted before core ownership is established. These tests do
  not redefine what happens if a component changes ownership after mounting.
- Live `open` wins over `defaultOpen`. Defaults seed once; they are not parent
  writebacks.
- Calendar `view`/`focusedValue` and other documented mutable-sync fields are not
  run through the veto scenario. This is not a change to their contract.
- These are selected cross-framework invariants, not a claim that all six
  components support every behavior or that every entry point has identical
  coverage. In particular, native form reset applies to form-associated inputs,
  not Dialog or Tree.
- Detailed NumberInput reset, replacement and IME interruption cases remain in
  Svelte's `number-reset.test.ts` and `native-input.test.ts`. React's native input
  suite keeps its own composition, delayed reconciliation and replacement tests.
  Those specialized suites are not replaced by the ownership table.
- Solid NumberInput middle-caret preservation is **not established** by this
  suite. A supplemental happy-dom probe of entering `1.` with the caret at 1
  observed it moving to 2 after the reactive update. That probe requires an
  independent native-text investigation and real-browser confirmation. There is
  no skipped or expected-failure case hidden in the passing shared matrix.
- Vue/Solid IME interruption/replacement parity and broad NumberInput reset
  parity remain follow-up work. The added Vue caret assertion covers ordinary
  partial-number editing, not composition.

## Running and interpreting results

The files are discovered by each package's existing Chromium Vitest project;
no package manifest, publishing script, or workflow changes are needed. Run the
normal repository test command for the real-browser gate.

For React, Vue and Solid, supplemental probes can run the named files with
`vitest run <files> --browser.enabled=false --environment happy-dom`. Native
Svelte mounting additionally needs the `browser` package-resolution condition
for Svelte and its core adapter. A simulated-DOM pass is useful for ownership,
callback ordering and cleanup, but does not replace Chromium verification of
native reset, focus, selection, layout, accessibility or real IME behavior.
