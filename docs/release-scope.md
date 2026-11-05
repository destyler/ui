# Release scope

The publish guard is a release-scope check, not a build, a pack, an npm dry run,
registry authentication, or permission to publish. It requires only Node.js and
runs before pnpm setup/install in the CI and release workflows.

## Safe local checks

```sh
node scripts/publish-packages.mjs
node scripts/publish-packages.mjs --check
node --test scripts/test-publish.mjs
```

The first two commands are equivalent and offline. They do not start pnpm,
contact a registry, or execute package lifecycle scripts. The tests use temporary
fixtures and nonpublishing package-manager stubs. They do not publish or run
those hooks.
After dependencies are installed, `pnpm run check:publish` and
`pnpm run test:publish` are convenience aliases for the same native commands.

Do not substitute `pnpm publish --dry-run`: npm/pnpm dry runs can still execute
packaging and lifecycle work. Unknown, combined, and forwarded guard arguments
are rejected rather than passed through to pnpm.

## Reviewed inventory

`scripts/publish-targets.json` lists the exact path/name allowlist. The guard
independently anchors this scope, so changing the JSON alone cannot widen it.
Nine workspace projects, including the root, are allowed:

| Path | Name | Release status |
| --- | --- | --- |
| `.` | `@destyler-ui/monorepo` | Private |
| `docs` | `@destyler-ui/docs` | Private |
| `utils` | `@destyler-ui/private` | Private |
| `tooling/eslint-react-compat` | `@destyler-ui/eslint-react-compat` | Private |
| `tooling/eslint-solid` | `@destyler-ui/eslint-solid` | Private |
| `packages/react` | `@destyler-ui/react` | Public |
| `packages/solid` | `@destyler-ui/solid` | Public |
| `packages/svelte` | `@destyler-ui/svelte` | Public |
| `packages/vue` | `@destyler-ui/vue` | Public |

Every private project must have JSON boolean `"private": true`. The string
`"true"`, omission, and all other values are rejected. A public project may omit
`private` or set it to boolean `false`. Its `publishConfig` must be exactly
`{ "access": "public" }`; directory, identity, version, registry, or other
publish overrides require separate review.

Public versions must be canonical ASCII npm-compatible SemVer and exactly match
the root release version. Leading `v`, whitespace, and other inputs requiring
normalization are rejected, even if a permissive version parser accepts them. Versions present on private workspaces must also be valid.
The guard does not edit or bump versions.

The supported workspace patterns, in order, are `docs`, `packages/*`, `utils`,
and `tooling/*`. The guard reads the current YAML block-list subset strictly and
rejects changed/duplicate/ambiguous pattern declarations and unreviewed top-level
configuration keys. It is not a general YAML parser. Non-workspace directories
such as `packages/tests` remain allowed when they have no manifest. Extra or
missing workspaces, duplicate identities, alternate `package.json5`,
`package.yaml`, or `package.yml` manifests, duplicate JSON members, and symlinked
workspace directories, parents, manifests, policy, or workspace configuration
are rejected. Malformed UTF-8 in files or discovery output is also rejected
rather than silently replaced while decoding. This does not prohibit pnpm's ordinary `node_modules` symlinks.

A planned scope or workspace-configuration change must update and review the
policy, guard anchors, tests, and this inventory together. Do not loosen checks
or mark additional packages public to work around a failure.

## Explicit publishing

### Release-note preparation

The root `pnpm release` command bumps versions, commits, pushes, and creates a
tag. A pushed `v*` tag starts the [Release workflow](../.github/workflows/release.yml),
which runs `npx changelogithub` after verification to generate GitHub release
notes from the release's changes. This document is a manual preparation source;
it is not automatically included in those generated notes.

Before an authorized release, review its commit range and prepare the breaking
changes and migration links below for the GitHub release description. After
generation, verify that the published description includes them, adding any
missing detail through the authorized release process. Do not rely on a commit
title alone: the changelog generation step currently allows failure without
blocking npm publication. Neither a successful publish guard nor an npm publish
confirms that these migration notes reached users.

#### UI 0.0.2: Vue void-element hydration

Include the [0.0.2 release notes and upgrade guidance](releases/0.0.2.md) in the
GitHub release description. This patch fixes Vue SSR hydration mismatches from
slot fragments under native void elements. The other three public packages
receive the synchronized version only; core remains at 0.3.3.

#### Published migration: Svelte Tree branch triggers

The Svelte Tree branch-trigger migration was published in
[v0.0.1-beta.20](https://github.com/destyler/ui/releases/tag/v0.0.1-beta.20).
Link those migration notes when preparing the first stable release; this is
not a newly introduced change in 0.0.1.

- `Tree.BranchTrigger` renders a non-tabbable `div` with `role="button"`.
  `Tree.BranchControl` owns keyboard navigation and the roving tab stop.
- Public props and event `currentTarget` types describe `HTMLDivElement`.
  Consumers needing a different element must use explicit `asChild` composition.
- Follow the [Tree branch triggers migration guide](https://github.com/destyler/ui/blob/main/packages/svelte/README.md#tree-branch-triggers).
  Check composed keyboard behavior and avoid extra tab stops or nested controls.

### Publish guard

`pnpm run publish:ci` invokes `node scripts/publish-packages.mjs --publish`.
This is the real publishing mode and is intended only for an authorized release,
after all existing release gates pass. No argument means check only.

Before a publish command can start, the guard:

1. Validates the policy, workspace patterns, on-disk inventory, names, privacy,
   public access, and versions with native Node.js.
2. Runs read-only `pnpm -r --include-workspace-root list --depth -1 --json` and
   checks all nine names, canonical paths, versions, and privacy flags.
3. Runs the same listing with four explicit fully scoped name filters and
   verifies that exactly the four public targets were selected.
4. Reopens and validates the original policy, workspace YAML, and every
   manifest after each external discovery call. Any content or inventory
   change aborts before publishing, even when the replacement is otherwise
   valid. Command failures, signals, missing output, malformed JSON, duplicate
   rows, or selection mismatches also abort.
5. Uses those same four exact filters with the existing recursive publishing
   semantics: `-r publish --access public --no-git-checks`.

No shell command interpolation, wildcard/dependency filters, `--force`, tag
changes, `--ignore-scripts`, or additional publishing flags are introduced.
The existing `prepublishOnly` and `prepack` hooks still run during a real publish;
the guard does not replace or skip them. The existing root `release` command,
including its version/commit/push/tag behavior, and every release verification
gate are unchanged.

This guard prevents unintended workspace selection. It is not a sandbox for a
compromised pnpm executable, malicious lifecycle code, or concurrent writers
mutating files after the final check. Release from a trusted, isolated checkout.
Recursive publishing is not atomic: earlier packages may publish successfully
before a later lifecycle or registry failure.
Scope validation passing does not establish that builds, browser tests,
credentials, network access, or npm publication will succeed.
