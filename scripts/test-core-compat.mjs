import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { cp, mkdir, readFile, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

import { assertCoreVersions, assertInstalledArtifact, getArtifactIdentity, prepareEvidenceDirectory, requireNodePolicy, requireTarball } from './core-compat-utils.mjs'

const root = fileURLToPath(new URL('..', import.meta.url))
const [source, output] = process.argv.slice(2)
assert.ok(source && output, 'Usage: node scripts/test-core-compat.mjs <exact UI version | tarball directory> <evidence directory>')
const registry = /^\d+\.\d+\.\d+(?:-[\w.]+)?$/.test(source)
const core = '0.3.0'
const runtimes = {
  react: { 'react': '19.3.0', 'react-dom': '19.3.0' },
  vue: { vue: '3.5.44' },
  solid: { 'solid-js': '1.9.17', 'vite-plugin-solid': '2.11.14' },
  svelte: { 'svelte': '5.57.2', '@sveltejs/vite-plugin-svelte': '6.2.1' },
}
const evidence = await prepareEvidenceDirectory(path.resolve(output))
const nodePolicy = requireNodePolicy(JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8')))
function run(command, args, cwd) {
  const result = spawnSync(command, args, { cwd, encoding: 'utf8', env: process.env, maxBuffer: 20 * 1024 * 1024 })
  const log = `${result.stdout || ''}${result.stderr || ''}`
  process.stdout.write(log)
  if (result.error || result.status !== 0)
    throw new Error(`${command} ${args.join(' ')} failed (${result.status}): ${result.error || log}`)
  return log
}
const results = []
for (const [framework, dependencies] of Object.entries(runtimes)) {
  const consumer = path.join(evidence, framework)
  const name = `@destyler-ui/${framework}`
  let stage = 'prepare'
  try {
    // A fresh directory prevents an old lock/install from silently changing the test.
    await mkdir(consumer)
    await cp(path.join(root, 'scripts/fixtures/core-compat'), consumer, { recursive: true })
    const manifest = JSON.parse(await readFile(path.join(root, 'packages', framework, 'package.json'), 'utf8'))
    const overrides = Object.fromEntries(Object.keys(manifest.dependencies).filter(key => key.startsWith('@destyler/')).map(key => [key, core]))
    const uiSource = registry ? source : `file:${await requireTarball(source, framework, manifest.version)}`
    await writeFile(path.join(consumer, 'package.json'), JSON.stringify({
      name: `destyler-${framework}-core-compat`,
      private: true,
      type: 'module',
      dependencies: { [name]: uiSource, ...dependencies, 'happy-dom': '21.0.1', 'vite': '7.2.7' },
      overrides,
    }, null, 2))
    stage = 'install'
    await writeFile(path.join(consumer, 'install.log'), run(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['install', '--engine-strict', '--ignore-scripts', '--no-audit', '--no-fund'], consumer))
    const installed = path.join(consumer, 'node_modules', name)
    await assertInstalledArtifact(installed, consumer)
    const require = createRequire(path.join(installed, 'package.json'))
    const installedManifest = JSON.parse(await readFile(path.join(installed, 'package.json'), 'utf8'))
    const dialogManifest = path.resolve(path.dirname(require.resolve('@destyler/dialog')), '../package.json')
    const dialogVersion = JSON.parse(await readFile(dialogManifest, 'utf8')).version
    assert.equal(dialogVersion, core)
    if (registry) {
      assert.equal(installedManifest.version, source)
    }
    else {
      assert.equal(installedManifest.version, manifest.version)
      assert.equal(installedManifest.engines?.node, nodePolicy, 'Packed package must match the workspace Node support policy')
    }
    const lock = await readFile(path.join(consumer, 'package-lock.json'), 'utf8')
    const parsedLock = JSON.parse(lock)
    const uiArtifact = getArtifactIdentity(parsedLock, name)
    const resolvedCore = Object.fromEntries(Object.entries(parsedLock.packages).filter(([key]) => /node_modules\/@destyler\//.test(key)).map(([key, value]) => [key, value.version]))
    assertCoreVersions(resolvedCore, core)
    const resolvedRuntimes = Object.fromEntries(await Promise.all(Object.keys(dependencies).map(async (dependency) => {
      const runtime = JSON.parse(await readFile(path.join(consumer, 'node_modules', dependency, 'package.json'), 'utf8'))
      assert.equal(runtime.version, dependencies[dependency], `${dependency} must match its exact test pin`)
      return [dependency, runtime.version]
    })))
    const versions = { ui: installedManifest.version, uiArtifact, dialog: dialogVersion, node: process.version, source, runtimes: resolvedRuntimes, core: resolvedCore, lockSha256: createHash('sha256').update(lock).digest('hex') }
    await writeFile(path.join(consumer, 'versions.json'), JSON.stringify(versions, null, 2))
    stage = 'build'
    await writeFile(path.join(consumer, 'build.log'), run(process.execPath, ['build.mjs', framework], consumer))
    stage = 'interaction'
    await writeFile(path.join(consumer, 'interaction.log'), run(process.execPath, ['--conditions=browser', 'run.mjs'], consumer))
    results.push({ framework, status: 'passed', ...versions })
  }
  catch (error) {
    await writeFile(path.join(consumer, `${stage}-failure.log`), String(error))
    results.push({ framework, status: 'failed', stage, error: String(error) })
    console.error(`${framework}: ${stage} failed`)
  }
}
await writeFile(path.join(evidence, 'results.json'), JSON.stringify(results, null, 2))
console.log(JSON.stringify(results, null, 2))
if (results.some(result => result.status !== 'passed'))
  process.exitCode = 1
