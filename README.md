<h1 align=center>destyler/ui</h1>

<p align=center>
  <strong>
    Build scalable design systems with unstyled, accessible UI components
  </strong>
</p>

<p align="center">
<a href="https://www.npmjs.com/package/@destyler-ui/vue" target="__blank"><img src="https://img.shields.io/npm/v/@destyler-ui/vue?color=a1b858&label=" alt="NPM version"></a>
<a href="https://www.npmjs.com/package/@destyler-ui/vue" target="__blank"><img alt="NPM Downloads" src="https://img.shields.io/npm/dm/@destyler-ui/vue?color=50a36f&label="></a>
<a href="https://www.npmjs.com/package/@destyler-ui/svelte" target="__blank"><img src="https://img.shields.io/npm/v/@destyler-ui/svelte?color=ff3e00&label=" alt="Svelte NPM version"></a>
<a href="https://www.npmjs.com/package/@destyler-ui/svelte" target="__blank"><img alt="Svelte NPM Downloads" src="https://img.shields.io/npm/dm/@destyler-ui/svelte?color=ff3e00&label="></a>
<a href="https://www.npmjs.com/package/@destyler-ui/solid" target="__blank"><img src="https://img.shields.io/npm/v/@destyler-ui/solid?color=2c4f7c&label=" alt="Solid NPM version"></a>
<a href="https://www.npmjs.com/package/@destyler-ui/solid" target="__blank"><img alt="Solid NPM Downloads" src="https://img.shields.io/npm/dm/@destyler-ui/solid?color=2c4f7c&label="></a>
<!-- <a href="https://ui.destyler.org/" target="__blank"><img src="https://img.shields.io/static/v1?label=&message=docs%20%26%20demos&color=1e8a7a" alt="Docs & Demos"></a> -->
<br>
<!-- <a href="https://github.com/destyler/destyler/stargazers" target="__blank"><img alt="GitHub stars" src="https://img.shields.io/github/stars/destyler/destyler?style=social"></a> -->
</p>

## Browser accessibility smoke gate

Run `pnpm exec playwright install --with-deps chromium firefox webkit`, then
`pnpm run test:browser-smoke`. The dedicated Node 22 CI job runs three shared
cases (Checkbox, Dialog, Tree) in React, Vue, Svelte and Solid across Chromium,
Firefox and WebKit: **36 real-browser cases**, plus browser-free policy tests.
JUnit results and failure screenshots are retained as CI artifacts. Release
verification runs this smoke command before publication as well.

The suite uses the existing Basic examples, except Solid Dialog uses its existing
interactive test fixture (the Basic example is controlled permanently open).
Native browser keys check Checkbox's accessible label and repeated Space toggles;
Dialog's name, description, modal state, initial focus, forward/backward wrap,
Escape focus restoration and reopening; and Tree's accessible name, roving focus,
arrows, selection, collapse and repeated expansion. Dialog examples have one
focusable control: this is a single-control trap regression, not a multi-control
focus-order test. Existing production Vite/Vitest configurations and test setup
mocks are not changed or imported into the smoke project. The four browser render
adapters register their own `beforeEach` cleanup and Vitest component-cleanup hook;
React awaits its cleanup. The shared suite only removes its own starting button.

axe-core 4.11.0 scans the entire body, including portals, for WCAG 2.0 and 2.1 A/AA
tagged rules. Only color contrast is disabled because these primitives are
unstyled; styled applications must test contrast separately. No severity or
subtree exclusions are used. Every violation fails. Every incomplete result also
fails, except for two narrowly validated Dialog review results:

- After the modal keyboard assertions, `aria-hidden-focus` must have nonempty
  nodes each containing exactly one `all` check, `focusable-modal-open`, and empty
  `any`/`none`
- After two close/reopen cycles and restored focus, `aria-valid-attr-value` may
  contain exactly one node and one `all` check of the same name, empty `any`/`none`
  and related nodes, and exactly the data keys `messageKey: controlsWithinPopup`
  and the matching `needsReview: aria-controls="<dialog ID>"`. The actual tested
  trigger and content must remain connected with unique matching IDs, the
  collapsed Dialog trigger must retain focus, and its referenced modal dialog
  must be closed and hidden. The axe target must resolve only to that trigger,
  whose only ARIA attributes are `aria-controls`, `aria-expanded` and
  `aria-haspopup` (preventing axe's single review message from masking another
  unresolved attribute)

This second review is specific to axe-core 4.11.0: its
`ariaValidAttrValueEvaluate` marks popup `aria-controls` for review even when the
referenced ID exists. The suite verifies that relationship rather than removing
runtime ARIA or skipping the closed-state scan. Rule/node/check errors, root scan
errors, extra checks and all other incomplete results still fail. Both review
results are explicitly logged as **not a clean automated scan** and still require
human assistive-technology review. Browser-free negative policy tests protect the
exact shapes and DOM relationships; run them alone with
`pnpm run test:smoke-policy`.

This first gate deliberately covers only these three fixtures. Combobox and other
components, disabled/invalid variants, multiple modal controls, styled contrast,
manual screen-reader/native assistive-technology checks and OS-level combinations
remain outside its scope. Engine coverage is not Safari/macOS or device coverage.
Passing this gate does not establish WCAG conformance or complete accessibility.
