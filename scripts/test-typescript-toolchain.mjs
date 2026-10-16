import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import process from 'node:process'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const nativePath = join(root, 'node_modules/@typescript/native/package.json')
const native = JSON.parse(await readFile(nativePath, 'utf8'))
const api = JSON.parse(await readFile(join(root, 'node_modules/typescript/package.json'), 'utf8'))
const compiler = resolve(dirname(nativePath), typeof native.bin === 'string' ? native.bin : native.bin.tsc)
const svelteRequire = createRequire(join(root, 'packages/svelte/scripts/check-package-consumer.cjs'))
const apiCompiler = svelteRequire.resolve('typescript/bin/tsc6')

function compile(args) {
  const result = spawnSync(compiler, args, { encoding: 'utf8' })
  assert.equal(result.error, undefined)
  return result
}

test('the actual native compiler and supported JavaScript API are separate official packages', () => {
  assert.equal(native.name, 'typescript')
  assert.equal(native.version, '7.0.2')
  assert.equal(api.name, '@typescript/typescript6')
  assert.equal(api.version, '6.0.2')
  assert.match(ts.version, /^6\./u)
  assert.equal(typeof ts.createSourceFile, 'function')
  const ast = ts.createSourceFile('probe.ts', 'const count: number = 1', ts.ScriptTarget.Latest, true)
  assert.equal(ast.statements.length, 1)
  assert.ok(ts.isVariableStatement(ast.statements[0]))
  const result = compile(['--version'])
  assert.equal(result.status, 0, result.stderr)
  assert.match(result.stdout, /Version 7\.0\.2/u)
})

test('native TypeScript executes strict positive and negative compilations', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'destyler-native-typescript-'))
  try {
    await writeFile(join(dir, 'tsconfig.json'), JSON.stringify({ compilerOptions: { strict: true, noEmit: true, target: 'ES2022', module: 'ESNext', types: [], skipLibCheck: true }, files: ['probe.ts'] }))
    await writeFile(join(dir, 'probe.ts'), 'export const count: number = 1\n')
    const good = compile(['--project', join(dir, 'tsconfig.json')])
    assert.equal(good.status, 0, `${good.stdout}${good.stderr}`)
    await writeFile(join(dir, 'probe.ts'), 'export const count: number = "wrong"\n')
    const bad = compile(['--project', join(dir, 'tsconfig.json')])
    assert.equal(bad.status, 1)
    assert.match(`${bad.stdout}${bad.stderr}`, /TS2322/u)
  }
  finally {
    await rm(dir, { recursive: true, force: true })
  }
})

test('the Svelte consumer can execute the API-compatible TypeScript CLI', async () => {
  const version = spawnSync(process.execPath, [apiCompiler, '--version'], { encoding: 'utf8' })
  assert.equal(version.error, undefined)
  assert.equal(version.status, 0, version.stderr)
  assert.equal(version.stdout.trim(), `Version ${ts.version}`)
  assert.equal(api.bin.tsc6, './bin/tsc6')

  const dir = await mkdtemp(join(tmpdir(), 'destyler-svelte-typescript-'))
  try {
    await writeFile(join(dir, 'tsconfig.json'), JSON.stringify({ compilerOptions: { strict: true, noEmit: true, target: 'ES2022', module: 'NodeNext', moduleResolution: 'NodeNext', types: [], skipLibCheck: false }, files: ['probe.ts'] }))
    await writeFile(join(dir, 'probe.ts'), 'export const count: number = 1\n')
    const good = spawnSync(process.execPath, [apiCompiler, '--project', join(dir, 'tsconfig.json')], { encoding: 'utf8' })
    assert.equal(good.error, undefined)
    assert.equal(good.status, 0, `${good.stdout}${good.stderr}`)
    await writeFile(join(dir, 'probe.ts'), 'export const count: number = "wrong"\n')
    const bad = spawnSync(process.execPath, [apiCompiler, '--project', join(dir, 'tsconfig.json')], { encoding: 'utf8' })
    assert.equal(bad.error, undefined)
    assert.equal(bad.status, 2)
    assert.match(`${bad.stdout}${bad.stderr}`, /TS2322/u)
  }
  finally {
    await rm(dir, { recursive: true, force: true })
  }
})
