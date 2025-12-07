## Workspace Facts
- Monorepo managed by pnpm 10 (`pnpm-workspace.yaml`); key publishable package is `packages/vue`, while `utils/` holds shared CSS helpers bundled via path exports.
- Root scripts fan out with filters (see `package.json`); `pnpm build`/`pnpm test:ci` recurse through every package, so prefer `pnpm vue <script>` when you only target the Vue library.
- The Vue package builds with `tsdown` (`packages/vue/tsdown.config.ts`) and uses Vite/Rolldown config in `packages/vue/vite.config.ts`, including the `~/` alias pointing at `packages/vue/src`.
- `src/index.ts` re-exports components, composables, providers, and shared types; every new surface must be wired here to ship in the published bundle.

## Build & Verification
- Install deps with `pnpm install`; use `pnpm vue dev` for a watch-mode `tsdown` build and `pnpm vue build` for production bundles.
- Storybook lives inside the Vue package; run `pnpm vue storybook` (dev) or `pnpm vue build-storybook` to refresh `packages/vue/storybook-static`.
- Browser-aware tests run through `pnpm vue test` (`vitest run --browser.headless`); `vitest.dev/test:ui` scripts are wired for TDD.
- Linting is `pnpm lint` using `@antfu/eslint-config` (`eslint.config.mjs`); fix with `pnpm lint:fix` before release.
- Release tooling is `pnpm release` (bumps versions across `packages/**`) followed by `pnpm publish:ci` in CI; do not hand-edit package versions.

## Component System
- Each component folder (e.g. `packages/vue/src/components/collapse/`) contains `anatomy.ts`, `types.ts`, `namespace.ts`, `components/*.vue`, `composables/`, `stories/`, and `test/`; keep this layout when adding features (Plop templates live in `template/vue/**`).
- Components wrap headless state machines from `@destyler/*`; `useCollapse` (`components/collapse/composables/use-collapse.ts`) shows the pattern: derive a machine context, call `useMachine` from `@destyler/vue`, and expose the connected API via Vue `computed`.
- Namespace exports (see `components/collapse/namespace.ts`) provide tree-shakable `Collapse.Root`, `Collapse.Item`, etc.—update both the flat `index.ts` exports and the namespace when creating or renaming pieces.
- Anatomy tokens are re-exported straight from the upstream package (`components/collapse/anatomy.ts`); reference them in CSS recipes instead of inventing selectors.
- Cross-component reuse is common: `CollapseItem` renders `Collapsible.Root` (`components/collapse/components/Item.vue`), so respect existing contracts before changing props/events.
- Shared styles should be authored downstream; these Vue components are intentionally unstyled besides structural wrappers like `<ui.div>`.

## Rendering & Context
- `~/factory.ts` defines the polymorphic `ui` JSX factory; every surface that accepts `asChild` should render through `<ui.tag ... :as-child="props.asChild">` so attributes merge correctly via `utils/Dynamic`.
- Always pair `PolymorphicProps` with `useForwardExpose` and, when bridging to native elements, `useForwardProps`/`useForwardPropsEmits` to keep attrs, events, and refs flowing (see `composables/use-forward-*.ts`).
- Feature hooks almost always read from providers: `useCollapse` consults `useEnvironmentContext` and `useLocaleContext` (from `src/providers`) to obtain the right window/document and text direction; wire new machines the same way.
- `RenderStrategyPropsProvider` (`composables/use-render-strategy.ts`) shares `lazyMount`/`unmountOnExit`; roots set it, descendants consume it to coordinate presence (e.g. `CollapseRoot` ➔ `CollapseItem`).
- `createContext` (`src/utils/create-context.ts`) returns `[Provider, useCtx]`; call the provider with a `computed` value immediately after instantiating a composable so hooks used later in the tree never see `undefined`.

## Testing Pattern
- Unit/integration tests live under `packages/vue/test/**`; each spec imports miniature fixture components from the same folder and renders them with `render` from `vitest-browser-vue` (see `test/composables/use-forward-props.test.ts`).
- `vitest.config.ts` enables Playwright-driven Chromium runs plus a `happy-dom` environment, so DOM APIs like `ResizeObserver` are available.
- Custom locator helpers are registered in `vitest.setup.ts`; extending or removing them changes every `page.getBy…` assertion, so modify cautiously.
- Screenshot expectations land in sibling `__screenshots__` folders; keep names in sync when updating fixtures.

## Scaffolding & Docs
- Use `pnpm generate:vue` (Plop generator) to scaffold a component; templates live in `template/vue/` and already include examples, stories, and tests wired to the conventions above.
- When adding providers or utilities, co-locate TypeScript definitions (`types.ts`) and export them through `src/providers/index.ts` or `src/utils/index.ts` so consumers inherit typings automatically.
- Path imports should prefer the `~/` alias instead of long relatives (`import { useCollapse } from '~/components/collapse'`).
- Document behavioral changes in component README/stories; the repo root README is intentionally minimal, so Storybook is the source of truth for usage guidance.
