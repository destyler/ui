import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test -- Keep fixture-toolchain recovery tests independent of Vite and browser setup.
import { test } from 'node:test'
import { ensureRollupNative } from './ensure-rollup-native.mjs'

const dependency = '@rollup/rollup-test-platform'
const version = '4.63.6'
const manifest = { version, optionalDependencies: { [dependency]: version } }

function missingError(name = dependency) {
  return new Error('Rollup native import failed', {
    cause: Object.assign(new Error(`Cannot find module '${name}'\nRequire stack:\n- rollup/dist/native.js`), { code: 'MODULE_NOT_FOUND' }),
  })
}

test('leaves a working Rollup installation untouched', () => {
  const imports = []
  ensureRollupNative(name => imports.push(name), () => assert.fail('must not install'))
  assert.deepEqual(imports, ['rollup'])
})

test('repairs the exact declared native dependency once and verifies it loads', () => {
  const installs = []
  let imports = 0
  ensureRollupNative((name) => {
    if (name === 'rollup/package.json')
      return manifest
    assert.equal(name, 'rollup')
    if (++imports === 1)
      throw missingError()
  }, specifier => installs.push(specifier))
  assert.deepEqual(installs, [`${dependency}@${version}`])
  assert.equal(imports, 2)
})

for (const [name, error, metadata] of [
  ['unrelated errors', new Error('consumer bug'), manifest],
  ['unrelated missing modules', missingError('some-other-package'), manifest],
  ['malformed missing-module messages', new Error('Rollup failure', { cause: { code: 'MODULE_NOT_FOUND', message: 'invalid message' } }), manifest],
  ['undeclared native packages', missingError(), { version, optionalDependencies: {} }],
  ['non-exact native versions', missingError(), { version, optionalDependencies: { [dependency]: '^4.63.6' } }],
]) {
  test(`does not repair or suppress ${name}`, () => {
    assert.throws(() => ensureRollupNative((entry) => {
      if (entry === 'rollup/package.json')
        return metadata
      throw error
    }, () => assert.fail('must not install')), caught => caught === error)
  })
}

test('fails immediately if the targeted install fails', () => {
  const failure = new Error('npm install failed')
  assert.throws(() => ensureRollupNative((entry) => {
    if (entry === 'rollup/package.json')
      return manifest
    throw missingError()
  }, () => { throw failure }), caught => caught === failure)
})

test('does not repeat a repair when the native import still fails', () => {
  const error = missingError()
  let installs = 0
  assert.throws(() => ensureRollupNative((entry) => {
    if (entry === 'rollup/package.json')
      return manifest
    throw error
  }, () => installs++), caught => caught === error)
  assert.equal(installs, 1)
})
