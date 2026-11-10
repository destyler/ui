# Calendar outside-month selection (0.0.5 release preparation)

`allowOutsideDays?: boolean` is an opt-in Calendar Root / useCalendar option across React, Vue, Solid, and Svelte. Omitted, `undefined`, or `false` preserves the existing behavior: dates shown outside their displayed month are not selectable.

This UI release requires core Calendar 0.3.5 or later. The `@destyler/calendar` catalog floor is `^0.3.5`, and the exact-core packed-consumer gate targets 0.3.5 across all four frameworks. The production core catalog is aligned to 0.3.5 because mixing Calendar 0.3.5 with 0.3.4 Anatomy/XState types fails the framework type-check and declaration-build gates. Core 0.3.4 does not implement this option.

With supporting core and `allowOutsideDays: true`, minimum/maximum dates, explicitly disabled cells, and unavailable dates must remain unselectable. This is not a CSS workaround and does not promise identical behavior to shadcn:

- Clicking an outside-month date updates the focused date and can navigate to its month.
- In range mode, hovering an outside-month date while choosing the end date can also navigate, because the existing range hover transition updates focus.
- Outside copies of dates remain excluded from roving focus to avoid duplicate focus targets in multi-month layouts.

`pnpm run test:calendar-contract` (also included in the existing `test:ci` entrypoint) checks source-level public types and Root prop-routing contracts only. It is not a component render, interaction, keyboard, or visual test. Browser verification remains outstanding. Before release, cover default/true/false and dynamic changes in all four framework wrappers, controlled value callbacks, min/max, disabled/unavailable dates, multi-month duplicates, and single/multiple/range interactions against the supporting core build.
