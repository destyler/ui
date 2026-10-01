# Packed Svelte consumer contract

Run `pnpm exec node scripts/test-svelte-package.mjs` from the workspace root.
The script cleans and builds the package, packs it with pnpm (resolving catalog
dependencies), and installs that tarball into an independent temporary npm project.
Neither a worktree link, source alias, declaration shim nor `skipLibCheck` is used.
Install scripts are disabled. The test verifies the exact framework version resolved
from the installed library, every advertised export target, and public entry imports.

The minimum and current framework versions are exact pins in the runner; update the
current pin deliberately when upgrading the workspace. TypeScript and test/build
tools are pinned too. The fixtures intentionally use ES2023 library definitions
because the published internationalized-number dependency uses Intl number ranges.

Development and production runs render on the server in one process, hydrate those
bytes in a fresh HappyDOM process, assert the server button was reused, and check
repeated toggle/collapsible clicks and exact change callbacks. Invalid public prop
types must fail compilation. SSR/client compiler builds import every public subpath.

`PACKED_BROWSER=1` additionally runs the hydration and interaction flow in real
Chromium through Playwright. The dedicated CI workflow installs the browser and
sets this flag. HappyDOM results do not establish real-browser behavior.

Strict TypeScript checks every public entry with both Bundler and NodeNext
resolution, with `skipLibCheck: false`. The Svelte fixture also passes
`svelte-check` without warnings. Core 0.2.9 supplies the real Svelte adapter
declarations required by NodeNext; neither check replaces them with a shim.
