import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdtemp } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

import { prepareEvidenceDirectory, withTemporaryDirectory } from './core-compat-utils.mjs'

const root = fileURLToPath(new URL('..', import.meta.url))
const evidence = await prepareEvidenceDirectory(process.argv[2] || await mkdtemp(path.join(tmpdir(), 'destyler-core-compat-evidence-')))
function pnpm(args, cwd = root, env = {}) {
  const command = process.env.npm_execpath
  const result = spawnSync(command ? process.execPath : 'pnpm', command ? [command, ...args] : args, {
    cwd,
    env: { ...process.env, ...env },
    stdio: 'inherit',
  })
  if (result.error)
    throw result.error
  assert.equal(result.status, 0, `pnpm ${args.join(' ')} failed`)
}
await withTemporaryDirectory('destyler-core-compat-tarballs-', async (tarballs) => {
  // Build before packing, bypass only prepack's duplicate full suites. Nothing is published.
  for (const framework of ['react', 'vue', 'solid', 'svelte']) {
    const packageDir = path.join(root, 'packages', framework)
    pnpm(['run', 'build'], packageDir)
    pnpm(['pack', '--pack-destination', tarballs], packageDir, { npm_config_ignore_scripts: 'true' })
  }
  const result = spawnSync(process.execPath, ['scripts/test-core-compat.mjs', tarballs, evidence], { cwd: root, stdio: 'inherit' })
  console.log(`Core compatibility evidence: ${path.resolve(evidence)}`)
  if (result.error)
    throw result.error
  process.exitCode = result.status ?? 1
})
