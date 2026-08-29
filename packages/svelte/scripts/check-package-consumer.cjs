const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')
const process = require('node:process')
const { pathToFileURL } = require('node:url')

const packageRoot = path.resolve(__dirname, '..')
const packageJson = require(path.join(packageRoot, 'package.json'))
const fixtureRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'destyler-svelte-consumer-'))
const packageLink = path.join(fixtureRoot, 'node_modules/@destyler-ui/svelte')

function run(command, args) {
  const result = spawnSync(command, args, { cwd: fixtureRoot, encoding: 'utf8' })
  assert.equal(result.status, 0, result.stderr || result.stdout)
}

try {
  for (const [subpath, conditions] of Object.entries(packageJson.exports)) {
    assert.equal(typeof conditions.types, 'string', `${subpath} is missing a types export condition`)
    assert.equal(typeof conditions.svelte, 'string', `${subpath} is missing a svelte export condition`)
    assert.equal(typeof conditions.default, 'string', `${subpath} is missing a default export condition`)
  }
  assert.equal(typeof packageJson.exports['./anatomy'].import, 'string')

  for (const extension of ['js', 'd.ts']) {
    const collectionIndex = fs.readFileSync(
      path.join(packageRoot, `dist/components/collection/index.${extension}`),
      'utf8',
    )
    assert.match(collectionIndex, /from '\.\/hooks\/use-list-collection\.svelte\.js'/)

    const selectIndex = fs.readFileSync(
      path.join(packageRoot, `dist/components/select/index.${extension}`),
      'utf8',
    )
    assert.match(selectIndex, /from '\.\/components\/Root\.svelte'/)
    assert.doesNotMatch(selectIndex, /from '\.\/components\/Root\.svelte\.js'/)
  }

  fs.mkdirSync(path.dirname(packageLink), { recursive: true })
  fs.symlinkSync(packageRoot, packageLink, process.platform === 'win32' ? 'junction' : 'dir')
  fs.writeFileSync(path.join(fixtureRoot, 'package.json'), JSON.stringify({ type: 'module' }))
  fs.writeFileSync(path.join(fixtureRoot, 'consumer.ts'), `
import { createAnatomy } from '@destyler-ui/svelte/anatomy'

export const anatomy = createAnatomy('consumer')
`)
  fs.writeFileSync(path.join(fixtureRoot, 'component-consumer.ts'), `
import type { PaginationRootProps } from '@destyler-ui/svelte/pagination'

export type ConsumerProps = PaginationRootProps
`)
  fs.writeFileSync(path.join(fixtureRoot, 'destyler-svelte-shim.d.ts'), `
export type PropTypes = Record<
  'button' | 'label' | 'input' | 'textarea' | 'img' | 'output' | 'element' | 'select' | 'rect' | 'style' | 'circle' | 'svg' | 'path',
  Record<string, unknown>
>
`)
  fs.writeFileSync(path.join(fixtureRoot, 'tsconfig.json'), JSON.stringify({
    compilerOptions: {
      allowArbitraryExtensions: true,
      baseUrl: '.',
      customConditions: ['svelte'],
      module: 'NodeNext',
      moduleResolution: 'NodeNext',
      noEmit: true,
      paths: {
        '@destyler/svelte': ['./destyler-svelte-shim.d.ts'],
      },
      skipLibCheck: false,
      strict: true,
      target: 'ES2022',
    },
    include: ['consumer.ts', 'component-consumer.ts'],
  }))
  fs.writeFileSync(path.join(fixtureRoot, 'tsconfig.bundler.json'), JSON.stringify({
    extends: './tsconfig.json',
    compilerOptions: {
      module: 'ESNext',
      moduleResolution: 'Bundler',
    },
    include: ['consumer.ts', 'component-consumer.ts'],
  }))

  const importAnatomy = `
    const anatomy = await import('@destyler-ui/svelte/anatomy')
    if (typeof anatomy.createAnatomy !== 'function')
      throw new Error('The anatomy subpath did not expose createAnatomy')
  `
  run(process.execPath, ['--input-type=module', '--eval', importAnatomy])
  run(process.execPath, ['--conditions=svelte', '--input-type=module', '--eval', importAnatomy])

  const collectionEntry = pathToFileURL(path.join(packageRoot, 'dist/components/collection/index.js')).href
  const importRuneHook = `
    const collection = await import(${JSON.stringify(collectionEntry)})
    if (typeof collection.useListCollection !== 'function')
      throw new Error('The collection entry did not expose its rune hook')
  `
  run(process.execPath, ['--conditions=svelte', '--input-type=module', '--eval', importRuneHook])

  const tsc = require.resolve('typescript/bin/tsc')
  run(process.execPath, [tsc, '--project', path.join(fixtureRoot, 'tsconfig.json')])
  run(process.execPath, [tsc, '--project', path.join(fixtureRoot, 'tsconfig.bundler.json')])
  process.stdout.write('Package consumer checked: Node ESM, svelte condition, and TypeScript NodeNext/Bundler\n')
}
finally {
  fs.rmSync(fixtureRoot, { recursive: true, force: true })
}
