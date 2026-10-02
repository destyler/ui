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

## License

[MIT](LICENSE)
