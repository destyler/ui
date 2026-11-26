# Inline Calendar

Use the mount-time `inline` option on Calendar Root or useCalendar when the grid
is always visible rather than presented in a popover. All four framework
adapters forward the option to Core. The default remains the popup calendar.

An inline Calendar needs Root, View and Table (with its cells and triggers),
but no Control, Trigger, Content or Positioner. Open/close and closeOnSelect
are popup-only options in inline mode. Remount the root to switch modes.

The option requires a Core version containing the inline implementation.
Before publishing UI, update the public calendar dependency floor and lockfile
to the actual released Core version; this local candidate does not invent a
release number.
