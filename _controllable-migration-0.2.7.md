# Controllable API migration — Destyler core 0.2.7 (Phase 3 HARD)

## API change

- Hard-removed public `*.controlled` flags (`open.controlled`, `value.controlled`, `checked.controlled`, `edit.controlled`, …).
- Controllable state uses `default*` props + prop-presence detection (`withControllableProvided` / `resolveControllableProp`).
- **Controlled** = the live prop (`open` / `value` / `checked` / …) is explicitly provided by the caller.
- **Uncontrolled** = pass `defaultOpen` / `defaultValue` / `defaultChecked` / `defaultSize` / … — **not** by stuffing the default into the live prop.

## Critical UI glue bug

Zag-era translation like:

```ts
'open': props.defaultOpen,
'open.controlled': props.open !== undefined,
```

or `checked: props.defaultChecked` / `value: props.modelValue ?? props.defaultValue` stamps the default into the live prop. On 0.2.7 presence-detection treats that as **controlled** and freezes state.

**Correct pattern:** pass through `open` / `defaultOpen` (etc.); omit any `*.controlled`; for Vue `modelValue`, map to live prop **only when defined**.

## Audit — files to migrate

### Vue (`packages/vue`) — source of truth

**`*.controlled` stamps + Omit leftovers**

- `components/calendar/composables/use-calendar.ts`
- `components/collapsible/composables/use-collapsible.ts`
- `components/color-picker/composables/use-color-picker.ts`
- `components/combobox/composables/use-combobox.ts`
- `components/dialog/composables/use-dialog.ts`
- `components/edit/composables/use-edit.ts`
- `components/floating-panel/composables/use-floating-panel.ts` (Omit only; wrong `open` mapping)
- `components/hover-card/composables/use-hover-card.ts`
- `components/menu/composables/use-menu.ts`
- `components/navigation-menu/composables/use-navigation-menu.ts`
- `components/popover/composables/use-popover.ts`
- `components/select/composables/use-select.ts`
- `components/tooltip/composables/use-tooltip.ts`

**Wrong `default*` → live-prop mappings (no `*.controlled` stamp)**

- `components/carousel/composables/use-carousel.ts` (`index: defaultPage`)
- `components/checkbox/composables/use-checkbox.ts` (`checked: defaultChecked`)
- `components/collapse/composables/use-collapse.ts` (`value: modelValue ?? defaultValue`)
- `components/dynamic/composables/use-dynamic.ts`
- `components/number-input/composables/use-number-input.ts`
- `components/otp-input/composables/use-otp-input.ts`
- `components/pagination/composables/use-pagination.ts` (`value: defaultPage`)
- `components/progress/composables/use-progress.ts`
- `components/qr-code/composables/use-qr-code.ts`
- `components/radio/composables/use-radio.ts`
- `components/slider/composables/use-slider.ts`
- `components/splitter/composables/use-splitter.ts` (`size: size ?? defaultSize`)
- `components/steps/composables/use-steps.ts` (`step: modelValue ?? defaultStep`)
- `components/switch/composables/use-switch.ts` (`checked: defaultChecked`)
- `components/tabs/composables/use-tabs.ts`
- `components/toggle-group/composables/use-toggle-group.ts`
- `components/tree/composables/use-tree.ts` (`selectedValue` / `expandedValue` coalesce)

**Out of scope (local v-model, not machine context)**

- `components/toggle/composables/use-toggle.ts` (useVModel / `defaultPressed`)
- `components/checkbox/composables/use-checkbox-group.ts` (local useVModel defaults)

### React (`packages/react`) — align to Vue

Same set of hooks under `components/*/hooks/use-*.ts` (dialog, collapsible, menu, popover, tooltip, hover-card, select, combobox, calendar, color-picker, edit, floating-panel, navigation-menu, checkbox, switch, tabs, slider, …).

### Solid (`packages/solid`) — align to Vue

Same set under `components/*/hooks/use-*.ts`.

### Svelte (`packages/svelte`) — align to Vue

- Shared helper: `src/lib/utils/create-machine-props.ts` (+ unit test)
- All `components/*/hooks/use-*.svelte.ts` that pass `{ open: 'defaultOpen' }` / controlled lists into `createMachineProps`
- `navigation-menu` special-case `value.controlled`

### Docs

- No docs hits for `*.controlled` at audit time; re-check after bump for broken seeds.

## Catalog

- Bump all `@destyler/*` and `@destyler/docs` in `pnpm-workspace.yaml` catalogs `^0.2.6` → `^0.2.7`.

## Migration status (completed)

- Catalog bumped to `^0.2.7`; lockfile refreshed.
- Vue / React / Solid / Svelte machine glue migrated: pass-through `open`/`defaultOpen` (etc.), no `*.controlled` stamps, no `default*`→live-prop seeding.
- Svelte `createMachineProps` rewritten for presence-based controllable API; unit tests updated.
- Combobox/pagination split-props updated for new `defaultInputValue` / `defaultPageSize` keys required by core 0.2.7 types.
- Grep for assignment/`Omit` of `*.controlled` in `packages/*/src`: empty.
