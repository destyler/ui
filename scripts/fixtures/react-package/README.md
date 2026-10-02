# React packed-consumer regression check

Run `pnpm --filter @destyler-ui/react check:package` from the repository root.
The command deletes the generated React `dist` directory, builds and packs the
package, then installs that tarball into temporary consumers outside the pnpm
workspace. These consumers never resolve the library through source aliases.
It first runs focused declaration-transform tests, including a strict TypeScript
consumer of every binding in a multi-variable declaration.

The matrix covers the declared minimum React/React DOM version (18.0.0) and the
current stable major (19.3.0). Versions, matching type packages, and consumer test
tools are pinned in `scripts/test-react-package.mjs`; update the current-major
case intentionally while retaining the minimum-supported boundary.

The library follows React's [compiled-library compatibility guidance](https://react.dev/reference/react-compiler/compiling-libraries):
compile for the minimum supported target and ship `react-compiler-runtime` as a
production dependency, so React 18 consumers do not need their own compiler setup.

For each consumer the check verifies:

- All published runtime and declaration entrypoints exist
- React Compiler's React 18 compatibility runtime is a production dependency
- Public JSX and namespace types compile with both Bundler and NodeNext resolution,
  with library declaration checking enabled
- Node imports and SSR work without browser globals
- Development and production SSR output hydrates without recoverable errors
- Hydration preserves the server DOM, and repeated Toggle and Collapsible
  interactions update accessible state and invoke change callbacks

Hydration uses Happy DOM in a separate process from SSR. It is a packaging and
compatibility regression check, not a substitute for the existing real-browser
component tests. `PACKED_BROWSER=1` also runs the same consumer flow in real Chromium. Its dedicated
CI workflow runs independently of the aggregate component suite, and release
verification enables it. The ready marker waits for a React effect after hydration
commits. Chromium uses a Vite development server under each NODE_ENV; this does not
claim production-bundled-asset coverage. The command requires registry access for isolated npm installs
and removes its temporary consumers when it exits.
