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
</p>

[Getting started](docs/src/content/docs/overview/getting-started.mdx) · [Installation](docs/src/content/docs/overview/installation.mdx) · [Component guides](docs/src/content/docs/components) · [Controllable state](docs/src/content/docs/overview/controllable-state.mdx)

## Choose core or UI

- **Destyler UI** (`@destyler-ui/*`, this repository) provides framework components composed from parts such as `Checkbox.Root`, `Checkbox.Control`, and `Checkbox.HiddenInput`. Use it when you want the component wiring handled for you while keeping control of styling and composition.
- **Destyler core** ([`destyler/destyler`](https://github.com/destyler/destyler)) provides lower-level state machines such as `@destyler/checkbox` and framework adapters such as `@destyler/react` and `@destyler/vue`. Use it when you want to connect a machine to your own rendering and component API.

The names are different: `@destyler/react` is a core adapter; `@destyler-ui/react` is the compound-component package. UI packages depend on the core packages they use, so you do not need to install individual machines for the UI examples below.

## Pick your framework

Install one UI package in an existing application. These are the **declared peer requirements** in the package manifests in this checkout:

| Framework | UI package and quick start | Declared peers |
| --- | --- | --- |
| React | [`@destyler-ui/react`](packages/react/README.md) | `react` and `react-dom` `>=18.0.0` |
| Vue | [`@destyler-ui/vue`](packages/vue/README.md) | `vue` `>=3.5.0` |
| Solid | [`@destyler-ui/solid`](packages/solid/README.md) | `solid-js` `>=1.8.0 <2.0.0` |
| Svelte | [`@destyler-ui/svelte`](packages/svelte/README.md) | `svelte` `>=5.29.0` |

```sh
# Choose the line for your application; do not install all four.
pnpm add @destyler-ui/react react react-dom
pnpm add @destyler-ui/vue vue
pnpm add @destyler-ui/solid solid-js
pnpm add @destyler-ui/svelte svelte
```

Use `npm install`, `yarn add`, or `bun add` if that is your project's package manager. Keep existing framework versions consistent with your application's requirements and the package's peers.

React and Vue components are imported from the package root, for example `import { Checkbox } from '@destyler-ui/react'`. Solid and Svelte also expose component subpaths; see their package guides. Core adapter availability does not imply a corresponding UI package for every framework.

### Compatibility and release caveats

The packages use beta versions. A peer range is a declaration, not a guarantee that every version, bundler, SSR setup, or application combination has been tested. See the [current CI configuration](.github/workflows/ci.yml) for the checks run in this repository.

The React guide records [packaging caveats from the evaluated source revision](packages/react/README.md#evaluated-source-packaging-caveats), including an entry-point mismatch and the compiler target.

These guides describe the checked-in API. The documentation site builds against workspace source, which does not by itself validate a registry package's entry points or declarations. Check your installed version and test it in your application; fixes and additional consumer checks in an open pull request are not released package support.

## Style and control components

Components are unstyled; no bundled stylesheet is required. Supply your own CSS or styling system and use the exposed `data-scope`, `data-part`, and state attributes. Keep the component parts needed for semantics and native behavior, including `Checkbox.HiddenInput` in the checkbox examples. Test keyboard interaction, focus, labels, and contrast in the final styled application.

For stateful roots, use a supported `default*` prop to seed uncontrolled state, or a live prop with its change callback / framework binding for controlled state. The [Controllable State guide](docs/src/content/docs/overview/controllable-state.mdx) covers ownership, framework examples, and component-specific exceptions. When upgrading older controlled-state code, read its section on removed `*.controlled` flags and the [core adapter/consumer migration notes](https://github.com/destyler/destyler/blob/main/CONTROLLED-API.md#adapter--consumer-migration-hard).

## Work on this repository

Use Node.js `>=20.19.0` and the repository's pinned package manager, `pnpm@10.28.0`.

```sh
pnpm install --frozen-lockfile
pnpm docs:dev
```

`docs:dev` prepares the framework builds and generated API data before starting the documentation server. Other entry points include `pnpm build`, `pnpm lint`, and `pnpm test:ci`; browser tests need Playwright browsers installed (`pnpm exec playwright install`). See [CI](.github/workflows/ci.yml) for the complete checks and system dependency setup.

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

## License

[MIT](LICENSE)
