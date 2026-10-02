import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { cp, mkdtemp, readdir, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))
const packageDir = path.join(root, 'packages/react')
const fixtureDir = path.join(root, 'scripts/fixtures/react-package')
const temporaryDir = await mkdtemp(path.join(tmpdir(), 'destyler-react-package-'))
const pnpmPath = process.env.npm_execpath
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm'

// Exact versions make regressions reproducible. Keep the lower boundary at the
// declared minimum and update the current-major case deliberately.
const consumers = [
  { react: '18.0.0', types: '18.3.31', domTypes: '18.3.7' },
  { react: '19.3.0', types: '19.3.0', domTypes: '19.3.0' },
]

function run(command, args, cwd, env = {}) {
  const result = spawnSync(command, args, {
    cwd,
    env: { ...process.env, ...env },
    stdio: 'inherit',
  })
  if (result.error)
    throw result.error
  assert.equal(result.status, 0, `${command} ${args.join(' ')} failed`)
}

function pnpm(args) {
  const filteredArgs = ['--filter', '@destyler-ui/react', ...args]
  if (pnpmPath)
    run(process.execPath, [pnpmPath, ...filteredArgs], root)
  else
    run(process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm', filteredArgs, root)
}

try {
  // A stale index.mjs must never conceal an incorrect published entrypoint.
  await rm(path.join(packageDir, 'dist'), { recursive: true, force: true })
  pnpm(['run', 'build'])
  pnpm(['pack', '--pack-destination', temporaryDir])
  const tarballs = (await readdir(temporaryDir)).filter(name => name.endsWith('.tgz'))
  assert.equal(tarballs.length, 1)

  for (const consumer of consumers) {
    const consumerDir = path.join(temporaryDir, `react-${consumer.react}`)
    await cp(fixtureDir, consumerDir, { recursive: true })
    await writeFile(path.join(consumerDir, 'package.json'), JSON.stringify({
      name: 'destyler-react-packed-consumer',
      private: true,
      type: 'module',
      dependencies: {
        '@destyler-ui/react': `file:${path.join(temporaryDir, tarballs[0])}`,
        '@types/react': consumer.types,
        '@types/react-dom': consumer.domTypes,
        'happy-dom': '20.3.3',
        'react': consumer.react,
        'react-dom': consumer.react,
        'typescript': '5.9.3',
        ...(process.env.PACKED_BROWSER === '1' ? { playwright: '1.57.0', vite: '7.2.7' } : {}),
      },
    }, null, 2))

    // This directory is outside the workspace: no workspace links, source
    // aliases, compiler transforms, or hoisted React versions can help it pass.
    run(npm, ['install', '--ignore-scripts', '--no-audit', '--no-fund', '--package-lock=false'], consumerDir)
    const installedDir = path.join(consumerDir, 'node_modules/@destyler-ui/react')
    const manifest = JSON.parse(await readFile(path.join(installedDir, 'package.json'), 'utf8'))
    for (const field of ['main', 'module', 'types']) {
      assert.equal(typeof manifest[field], 'string', `Missing ${field} entrypoint`)
      await readFile(path.join(installedDir, manifest[field]))
    }
    assert.ok(manifest.dependencies['react-compiler-runtime'], 'The compatibility runtime must ship as a dependency')
    const javascript = await readFile(path.join(installedDir, manifest.main), 'utf8')
    assert.ok(!javascript.includes('react/compiler-runtime'), 'The build must support React 18')

    const tsc = path.join(consumerDir, 'node_modules/typescript/bin/tsc')
    for (const resolution of ['bundler', 'nodenext']) {
      run(process.execPath, [tsc, '--project', 'tsconfig.json', '--moduleResolution', resolution, '--module', resolution === 'bundler' ? 'ESNext' : 'NodeNext'], consumerDir)
    }
    for (const mode of ['development', 'production']) {
      run(process.execPath, ['ssr.mjs'], consumerDir, { NODE_ENV: mode })
      run(process.execPath, ['hydrate.mjs'], consumerDir, { NODE_ENV: mode })
      if (process.env.PACKED_BROWSER === '1')
        run(process.execPath, ['browser.mjs'], consumerDir, { NODE_ENV: mode })
    }
    console.log(`Packed React ${consumer.react} consumer passed import, types, SSR, hydration and interaction checks`)
  }
}
finally {
  await rm(temporaryDir, { recursive: true, force: true })
}
