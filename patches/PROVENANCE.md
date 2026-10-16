# Private lint compatibility patches

These exact-version patches affect development tooling only, not public peers or
runtime code. Upgrades require independent review and the diagnostic guards.
The 2026-10-16 reconstruction uses verified official package sources and retained
source evidence; it does not claim byte identity with the lost local checkpoint.

## eslint-plugin-react-x 5.27.1

- Official npm source: eslint-plugin-react-x@5.27.1, dist/index.js.
- Upstream: https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x
- MIT license retained in eslint-plugin-react-x-LICENSE.
- allowRefDerived and allowEmptySetter default true, preserving upstream
  set-state-in-effect behavior. Both are false in the reviewed UI policy to retain
  direct-effect warnings, including ref-gated/ref-derived updates and empty calls.
- scripts/test-eslint-react-effect-policy.mjs exercises23 positive/negative cases
  under implicit default, explicit default, and the reviewed strict policy.

## eslint-plugin-solid 0.18.1

- Official npm source: eslint-plugin-solid@0.18.1.
- Upstream: https://github.com/solidjs-community/eslint-plugin-solid
- MIT license retained in eslint-plugin-solid-LICENSE.
- allowEagerMemoArguments defaults true, preserving upstream reactivity behavior.
  The reviewed UI policy sets false. The guard checks the original argument's
  call-site parent, not its traced initializer, so passing an accessor is valid
  but eagerly reading it in an untracked use*/create* call remains actionable.
- All six bundled runtimes, both declarations and matching TypeScript source
  carry the change. Source maps are not regenerated; inspect built sources when
  debugging patched positions.
- scripts/test-eslint-solid-reactivity-policy.mjs covers11 positive/negative
  cases across defaults, strict policy, and every ESM/CommonJS public entrypoint.
- Upstream direct-return primitive exemptions and other rules are unchanged.
