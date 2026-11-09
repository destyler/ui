# Calendar outside-month selection (0.0.5 release preparation)

`allowOutsideDays?: boolean` is an opt-in Calendar Root / useCalendar option across React, Vue, Solid, and Svelte. Omitted, `undefined`, or `false` preserves the existing behavior: dates shown outside their displayed month are not selectable.

This UI wiring requires a core Calendar release implementing the option. The currently declared `@destyler/calendar` dependency (`^0.3.4`) does not guarantee that capability: core 0.3.4 ignores it. Do not advertise the option as available or release this UI change until the core implementation and its dependency floor have been updated and verified. The UI manifests are prepared at 0.0.5, but this is not a published release. The release is blocked until core 0.3.5 is available, the Calendar catalog floor becomes ^0.3.5, and the regenerated lockfile and normal release gates pass. Do not publish the prepared manifests while the floor still permits 0.3.4.

With supporting core and `allowOutsideDays: true`, minimum/maximum dates, explicitly disabled cells, and unavailable dates must remain unselectable. This is not a CSS workaround and does not promise identical behavior to shadcn:

- Clicking an outside-month date updates the focused date and can navigate to its month.
- In range mode, hovering an outside-month date while choosing the end date can also navigate, because the existing range hover transition updates focus.
- Outside copies of dates remain excluded from roving focus to avoid duplicate focus targets in multi-month layouts.

`pnpm run test:calendar-contract` (also included in the existing `test:ci` entrypoint) checks source-level public types and Root prop-routing contracts only. It is not a component render, interaction, keyboard, or visual test. Browser verification remains outstanding. Before release, cover default/true/false and dynamic changes in all four framework wrappers, controlled value callbacks, min/max, disabled/unavailable dates, multi-month duplicates, and single/multiple/range interactions against the supporting core build.
