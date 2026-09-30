import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { cp, lstat, mkdtemp, readdir, readFile, realpath, rm, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { tmpdir } from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))
// Exact pins exercise the advertised lower bound and the workspace's current release.
const framework = 'vue'
const config = { dependency: 'vue', minimum: '3.5.0', current: '3.5.26', tools: {} }
const temporaryDir = await mkdtemp(path.join(tmpdir(), `destyler-${framework}-packed-`))
const packageDir = path.join(root, 'packages', framework)
const packageName = `@destyler-ui/${framework}`
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm'

function run(command, args, cwd, env = {}) {
  const result = spawnSync(command, args, { cwd, env: { ...process.env, ...env }, stdio: 'inherit' })
  if (result.error)
    throw result.error
  assert.equal(result.status, 0, `${command} ${args.join(' ')} failed`)
}

function pnpm(args, env = {}) {
  const command = process.env.npm_execpath
  if (command)
    run(process.execPath, [command, ...args], packageDir, env)
  else
    run(process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm', args, packageDir, env)
}

async function advertisedEntries(installedDir, manifest) {
  for (const field of ['main', 'module', 'types', 'svelte']) {
    if (manifest[field])
      await readFile(path.join(installedDir, manifest[field]))
  }
  const entries = new Set()
  for (const [subpath, conditions] of Object.entries(manifest.exports || { '.': manifest.main })) {
    const targets = typeof conditions === 'string' ? [conditions] : Object.values(conditions)
    const names = subpath.includes('*')
      ? (await readdir(path.join(installedDir, 'dist/components'), { withFileTypes: true })).filter(entry => entry.isDirectory()).map(entry => entry.name)
      : ['']
    for (const name of names) {
      for (const target of targets) {
        assert.equal(typeof target, 'string', `Unhandled export condition: ${subpath}`)
        await readFile(path.join(installedDir, target.replace('*', name)))
      }
      if (subpath !== './package.json')
        entries.add(subpath === '.' ? packageName : `${packageName}/${subpath.slice(2).replace('*', name)}`)
    }
  }
  return [...entries]
}

try {
  // Clean first: stale output must never conceal a missing published entry.
  await rm(path.join(packageDir, 'dist'), { recursive: true, force: true })
  pnpm(['run', 'build'])
  // Build is explicit above. Do not recursively invoke the package's full
  // browser/prepack suite; this is an independent, isolated consumer layer.
  pnpm(['pack', '--pack-destination', temporaryDir], { npm_config_ignore_scripts: 'true' })
  const tarballs = (await readdir(temporaryDir)).filter(name => name.endsWith('.tgz'))
  assert.equal(tarballs.length, 1)

  for (const version of [config.minimum, config.current]) {
    const consumerDir = path.join(temporaryDir, `${framework}-${version}`)
    await cp(path.join(root, 'scripts/fixtures/vue-package'), consumerDir, { recursive: true })
    await writeFile(path.join(consumerDir, 'package.json'), JSON.stringify({
      name: `destyler-${framework}-packed-consumer`,
      private: true,
      type: 'module',
      dependencies: {
        [packageName]: `file:${path.join(temporaryDir, tarballs[0])}`,
        [config.dependency]: version,
        'happy-dom': '20.3.3',
        'typescript': '5.9.3',
        'vite': '7.2.7',
        ...(process.env.PACKED_BROWSER === '1' ? { playwright: '1.57.0' } : {}),
        ...config.tools,
      },
    }, null, 2))
    run(npm, ['install', '--ignore-scripts', '--no-audit', '--no-fund', '--package-lock=false'], consumerDir)
    const installedDir = path.join(consumerDir, 'node_modules', packageName)
    assert.equal((await lstat(installedDir)).isSymbolicLink(), false, 'Install the tarball, never the worktree')
    assert.ok((await realpath(installedDir)).startsWith(consumerDir))
    const manifest = JSON.parse(await readFile(path.join(installedDir, 'package.json'), 'utf8'))
    const installedFramework = JSON.parse(await readFile(path.join(consumerDir, 'node_modules', config.dependency, 'package.json'), 'utf8'))
    assert.equal(installedFramework.version, version)
    const packageRequire = createRequire(path.join(installedDir, 'package.json'))
    assert.equal(packageRequire(`${config.dependency}/package.json`).version, version, 'The package must resolve the exact tested runtime')
    assert.ok(!JSON.stringify(manifest.dependencies).includes('catalog:'), 'Published dependencies must be resolved')
    assert.ok(manifest.peerDependencies[config.dependency].includes(config.minimum), 'Keep the minimum case aligned with the public peer range')
    const entries = await advertisedEntries(installedDir, manifest)
    await writeFile(path.join(consumerDir, 'entries.ts'), entries.map((entry, index) => `export * as entry${index} from '${entry}'`).join('\n'))
    const tsc = path.join(consumerDir, 'node_modules/typescript/bin/tsc')
    for (const resolution of ['Bundler', 'NodeNext']) {
      run(process.execPath, [tsc, '-p', 'tsconfig.json', '--moduleResolution', resolution, '--module', resolution === 'Bundler' ? 'ESNext' : 'NodeNext'], consumerDir)
    }
    for (const mode of ['development', 'production']) {
      run(process.execPath, ['ssr.mjs'], consumerDir, { NODE_ENV: mode })
      run(process.execPath, ['--conditions=browser', 'hydrate.mjs'], consumerDir, { NODE_ENV: mode })
      if (process.env.PACKED_BROWSER === '1')
        run(process.execPath, ['browser.mjs'], consumerDir, { NODE_ENV: mode })
    }
    console.log(`Packed ${framework} ${version}: ${entries.length} public entries, strict types, SSR, hydration and repeated interactions passed`)
  }
}
finally {
  await rm(temporaryDir, { recursive: true, force: true })
}
