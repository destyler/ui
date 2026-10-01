# API ownership and native pointer input

The controllable migration suite verifies API ownership with the production
React Compiler and unchanged open/close assertions. Its HoverCard case parks
the native browser cursor before mounting; supplemental happy-dom execution has
no native cursor and leaves that path unused. The parking target remains until
the existing document cleanup. No production event, timer, compiler, retry or
callback behavior changes.

## Why this precondition is necessary

The original full-suite failure was captured on core 0.2.10 at commit
`359546b448216823535801abe2ad47862975b97b`,
[Node 24 job](https://github.com/destyler/ui/actions/runs/36855824887/job/110347934665).
The capture passed the strict trace completeness validator with zero dropped
entries and the same machine instance throughout:

1. At 6.2 ms, `CLOSE` moved the raw machine to `closed`
2. At 6.3–7.4 ms, the false callback, React API and DOM all became closed
3. At 8–11.6 ms, Chromium delivered trusted pointerover/pointerenter at `(0, 0)`
   onto the new HoverCard trigger, with the preceding FloatingPanel trigger as
   related target
4. At 17.2 ms, the true callback and open DOM appeared; the raw machine's event
   was `POINTER_ENTER`, and the original close assertion then failed

For this captured failure, a newer native input legitimately superseded the API
request. It was not an ignored CLOSE or a stale React snapshot. Previous green
runs did not prove reliability, and this evidence does not classify unrelated
HoverCard defects. The completed observation tools remain in that historical
commit rather than running additional full-suite experiments on every PR.

## Coverage retained

All four original API open/close iterations, DOM checks and callback assertions
remain unchanged. The normal HoverCard browser suite explicitly proves that a
later native pointer entry still reopens after an API close, followed by native
pointer departure, twice with exact callback history. Native interaction is not
disabled or excluded from component coverage.
