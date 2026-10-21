# UI beta.17 / core 0.2.13 compatibility release checklist

Tracking: [UI #151](https://github.com/destyler/ui/issues/151). Core versioning
policy remains separately tracked in [core #353](https://github.com/destyler/destyler/issues/353).

## Reproduced on 2026-10-21

The baseline is main `979457eb`, with Node 24.19.0, core 0.2.13, React 19.3.0,
Vue 3.5.44, Solid 1.9.17, and Svelte 5.57.2. No Node support policy is changed:
all current UI packages still require Node >=22.22.3.

Explicitly installed `@destyler-ui/*@0.0.1-beta.17` results:

- Vue, Solid, Svelte: the omitted-open Dialog trigger does not open the Dialog.
- React: the public package entry fails Vite resolution before components mount.
  This result does not prove a React controlled-state failure.

Built and packed main artifacts pass all four Dialog state cases in all four
frameworks (16 cases). The checkout still carries the beta.17 version, so these
local tarballs are **not** evidence that registry beta.17 has been fixed. Source
migration is already present; do not repeat it or overwrite a published version.
See the [consumer instructions](../scripts/fixtures/core-compat/README.md) for
exact commands and coverage limits. The CI/release gate retains lockfiles and
version records. Other controls are covered by existing suites, not by this new
Dialog-specific gate; this is not an assertion that every beta.17 component fails.

## Release closure, requiring release authorization

1. Run the existing lint, framework type checks, test/SSR suites, packed consumer
   checks, and three-browser smoke suite on the candidate commit. Also pass
   `pnpm test:core-compat` on the supported Node floor. A focused local pass does
   not replace these existing release requirements.
2. Select a new unused beta version for all four UI packages. Review the packed
   manifests, resolved core minimum, exports, Node engines, and tarball contents.
   Do not republish beta.17 or weaken Node >=22.22.3.
3. Publish only the four intended public packages through the existing guarded
   workflow, after separately authorizing the version/release operation.
4. Verify all four new versions from the registry with the exact-version consumer
   command. Check registry integrity and the actual installed core/lockfiles.
5. Decide dist-tags explicitly. At issue review on 2026-10-21, Vue `latest` was
   beta.16 and `beta` was beta.17; the other packages had both tags at beta.17.
   Recheck these live before making any change; do not silently align them.
6. Only after replacement verification, decide whether to deprecate affected
   versions with an accurate upgrade hint. The reproduced range here is exactly
   beta.17; do not claim an untested broader range. Verify Vue beta.16 separately
   before deciding its treatment.
7. Link the released version and registry-consumer results in #151 before closing
   it. No release, tag change, deprecation, deployment, or issue closure is part
   of the test-only patch.
