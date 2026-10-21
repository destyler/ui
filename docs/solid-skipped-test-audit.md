# Solid skipped-test audit

Issue: [#156](https://github.com/destyler/ui/issues/156). Baseline: `879f2b4`.

The eight skipped declarations were test debt, not eight demonstrated runtime defects.
Parameterized declarations expand to multiple cases. This change does not alter runtime code.

| Declaration | Existing coverage and comparison | Disposition |
| --- | --- | --- |
| FileUpload Field readonly | Active required, disabled, helper/error and label-focus cases cover supported Field integration. Vue likewise does not assert readonly. `use-file-upload` does not forward Field readonly and core's FileUpload context does not expose it. | Remove the unsupported readonly-on-button expectation. Neither a native button nor a file input supports HTML readonly. This is not equivalent readonly coverage: a read-only upload interaction contract remains unsupported and would need a separately designed feature, not merely an attribute assertion. |
| Menu parts matrix | Active exports and interaction tests already cover opening, groups, nested menus and controlled state. React opens the parent for TriggerItem. | Restore every anatomy part assertion after opening the parent and observing its content, so nested TriggerItem has its parent context. |
| NumberInput fraction digits | Active stepping, blur clamping, formatting setup and ValueText tests do not verify fractional rounding/padding. React/Vue FractionDigits examples use defaultValue. | Replace fixed controlled value with defaultValue; verify maximum rounding after edit/blur and minimum padding after a second edit/blur. A fixed value without parent acceptance correctly stays `1.00`. |
| OtpInput Field required | Active editing, disabled, readonly and Field feedback cases do not verify aggregate native validation; React/Vue do not provide equivalent required coverage. | Assert required on the aggregate hidden text input, not each digit; verify native valueMissing, assembled value, and reactive removal of required. |
| Popover Escape | Active trigger/close-button, controlled and presence tests do not replace keyboard dismissal. Vue already opens before Escape. | Assert visible dialog and actual deferred keydown-listener readiness before sending Escape, then await hidden title and listener cleanup. The old test incorrectly expected the just-opened title to be hidden before sending the key. |
| Select item selection | Active close-on-select, callback and multiple-selection tests already cover selection behavior. React/Vue have single-selection text assertions. | Restore single-selection coverage and strengthen it with hidden form value, reopened selected state, and replacing the selection. No claim that selection was wholly untested. |
| Select lazy mount/unmount | Active lazy-mount-only test covers initial absence and first mount, not removal or remount. React/Vue cover removal. | Await actual removal on close, then verify remount on reopening. Move the nested InitialValue test to suite scope so it is registered independently. |
| Signature exports matrix | Active anatomy/rendering and Field tests do not verify the complete public namespace. React/Vue exclude the internal SegmentPath anatomy entry. | Restore public anatomy exports, exclude internal SVG SegmentPath, and include Context, HiddenInput and RootProvider. Segment renders the internal path; no public SegmentPath component is promised. |

## Verification notes

Local type checking, scoped lint and whitespace checks pass. Supplemental happy-dom
checks reproduce the original NumberInput and Popover premise failures and pass their
corrected tests, the Select suite, the restored OTP/export cases, and an isolated Menu
parts matrix. This diagnostic is not a replacement for the repository's Chromium suite:
menu's shared browser helper cannot load in the DOM pool, and an unchanged Signature
label-focus test fails there. Local Chromium startup is blocked by the environment's IPC
restriction. The normal browser suite and aggregate package checks must pass in CI before
this change is ready.

The first Chromium CI run passed on Node 24 but exposed a Popover Escape race on
Node 22: opening renders synchronously, while dismissal listeners register on the next
animation frame. The test now waits for the actual keydown listener using the existing
lifecycle tracker, not a fixed delay, and checks listener cleanup after dismissal.
