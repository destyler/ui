# Node.js support migration

The UI release containing this change requires Node.js **22.22.3 or newer** for
repository development, builds, tests, package installation, and server-side
rendering. The root manifest and all four public `@destyler-ui/*` package
manifests declare `engines.node: ">=22.22.3"`.

Node 20 and Node 22 versions below 22.22.3 are outside the UI support range.
Restoring Node 20 support is not planned for UI or core.

- UI requires Node.js 22.22.3 or newer starting with the release containing
  its support migration.
- [destyler/destyler#360](https://github.com/destyler/destyler/pull/360) sets
  the same minimum for all public `@destyler/*` packages in the next core
  release containing that change. See the
  [core Node support guide](https://github.com/destyler/destyler/blob/main/document/src/content/guide/node-support.mdx)
  for consumer requirements and the separate repository-tooling range.
- These migrations do not change previously published UI or core artifacts.

## Upgrade an application

1. Update Node.js on developer machines, CI, build images, and SSR hosting to
   22.22.3 or newer before installing the UI release containing this change.
2. Keep the application's framework version within the unchanged public peers:
   React and React DOM `>=18.0.0`, Vue `>=3.5.0`, Solid `>=1.8.0 <2.0.0`, or
   Svelte `>=5.29.0`.
3. Install normally with engine checking enabled, then run the application's
   type, build, SSR, hydration, and browser tests. For npm, use
   `npm install --engine-strict`; for pnpm, use `pnpm install --engine-strict`.

The repository enables `engine-strict=true` in its own `.npmrc`. That setting
does not propagate to a consuming application. npm treats dependency `engines`
as advisory by default, so an unsupported Node version may produce a warning
and still install. With `--engine-strict`, an ordinary install rejects an
incompatible engine unless the user explicitly overrides enforcement. See
[npm's engines documentation](https://docs.npmjs.com/cli/v11/configuring-npm/package-json/#engines)
and [engine-strict configuration](https://docs.npmjs.com/cli/v11/using-npm/config/#engine-strict).
There is no install script or runtime version guard in the UI packages.

## CI configuration and scope

- Source CI runs on exact Node 22.22.3 and the current Node 24 release.
  The full browser, unit, and four-framework SSR projects remain in `test:ci`.
- All existing package, documentation, Storybook, and evidence-upload checks
  previously gated on Node 22 are gated on exact Node 22.22.3. The lint, browser
  smoke, documentation deployment, and release workflows also use that floor.
- Each packed-consumer workflow uses exact Node 22.22.3, installs real tarballs
  with `--engine-strict`, and checks the installed package's engine declaration.
  It keeps its existing minimum and current framework versions, entry-point and
  type checks, development/production SSR, hydration, and browser interactions.
- Browser accessibility smoke still covers React, Vue, Solid, and Svelte in
  Chromium, Firefox, and WebKit.

These are the configured checks, not a claim that every permitted Node or
framework version has passed. Review successful checks for the exact release
commit. The engine range has no upper bound, but CI does not test every later
Node release or every application toolchain. Node 20 compatibility is no longer
a UI release requirement; no framework, SSR, hydration, type, or browser checks
are removed as part of this migration.
