// npm can silently omit Rollup's platform-specific optional dependency. Repair
// only that exact missing fixture-toolchain package, never a consumer failure.
export function ensureRollupNative(require, install) {
  try {
    require('rollup')
  }
  catch (error) {
    const cause = error?.cause
    const missing = cause?.code === 'MODULE_NOT_FOUND'
      && /^Cannot find module '(@rollup\/rollup-[a-z0-9-]+)'(?:\r?\n|$)/.exec(cause.message)?.[1]
    if (!missing)
      throw error

    const manifest = require('rollup/package.json')
    const version = manifest.optionalDependencies?.[missing]
    if (typeof version !== 'string' || version !== manifest.version)
      throw error

    install(`${missing}@${version}`)
    // Exactly one repair attempt. Any remaining load error must fail the gate.
    require('rollup')
  }
}
