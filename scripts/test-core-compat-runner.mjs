import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdir, mkdtemp, readdir, readFile, realpath, rm, symlink, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'
import { assertCoreVersions, assertInstalledArtifact, getArtifactIdentity, prepareEvidenceDirectory, requireNodePolicy, requireTarball, withTemporaryDirectory } from './core-compat-utils.mjs'

async function fixture(t) {
  const directory = await mkdtemp(path.join(tmpdir(), 'core-compat-test-'))
  t.after(() => rm(directory, { recursive: true, force: true }))
  return directory
}

test('accepts an installed artifact under a symlinked temporary-directory parent', async (t) => {
  const root = await fixture(t)
  const consumer = path.join(root, 'real', 'consumer')
  await mkdir(path.join(consumer, 'node_modules/ui'), { recursive: true })
  await symlink(path.join(root, 'real'), path.join(root, 'alias'), 'junction')
  const alias = path.join(root, 'alias', 'consumer')
  // Reproduces the old one-sided canonicalization failure without needing macOS.
  assert.equal((await realpath(path.join(alias, 'node_modules/ui'))).startsWith(alias), false)
  await assertInstalledArtifact(path.join(alias, 'node_modules/ui'), alias)
})

test('rejects a sibling whose name shares the consumer prefix', async (t) => {
  const root = await fixture(t)
  const consumer = path.join(root, 'consumer')
  const sibling = path.join(root, 'consumer-other', 'ui')
  await mkdir(consumer)
  await mkdir(sibling, { recursive: true })
  await assert.rejects(assertInstalledArtifact(sibling, consumer), /inside the consumer/)
})

test('rejects symlinked workspace artifacts', async (t) => {
  const root = await fixture(t)
  const consumer = path.join(root, 'consumer')
  await mkdir(consumer)
  await mkdir(path.join(root, 'workspace'))
  await symlink(path.join(root, 'workspace'), path.join(consumer, 'ui'), 'junction')
  await assert.rejects(assertInstalledArtifact(path.join(consumer, 'ui'), consumer), /workspace symlink/)
})

test('rejects evidence reuse without modifying existing results', async (t) => {
  const root = await fixture(t)
  const file = path.join(root, 'results.json')
  await writeFile(file, 'previous evidence')
  await assert.rejects(prepareEvidenceDirectory(root), /must be empty.*fresh directory/)
  assert.equal(await readFile(file, 'utf8'), 'previous evidence')
  assert.deepEqual(await readdir(root), ['results.json'])
})

test('creates and canonicalizes an empty evidence directory', async (t) => {
  const root = await fixture(t)
  const directory = path.join(root, 'new')
  assert.equal(await prepareEvidenceDirectory(directory), await realpath(directory))
})

test('reports a missing or non-file tarball before npm installation', async (t) => {
  const root = await fixture(t)
  await assert.rejects(requireTarball(root, 'vue', '1.0.0'), /Missing packed UI tarball/)
  const filename = path.join(root, 'destyler-ui-vue-1.0.0.tgz')
  await mkdir(filename)
  await assert.rejects(requireTarball(root, 'vue', '1.0.0'), /tarball file/)
})

test('accepts the exact tarball filename', async (t) => {
  const root = await fixture(t)
  const filename = path.join(root, 'destyler-ui-vue-1.0.0.tgz')
  await writeFile(filename, 'fixture')
  assert.equal(await requireTarball(root, 'vue', '1.0.0'), filename)
})

test('explains exact-core drift without silently overriding the failure', () => {
  assertCoreVersions({ 'node_modules/@destyler/dialog': '0.3.0' }, '0.3.0')
  assert.throws(() => assertCoreVersions({ 'node_modules/@destyler/transitive': '0.3.1' }, '0.3.0'), /transitive.*0.3.1.*0.3.0.*overrides/)
})

for (const fail of [false, true]) {
  test(`removes only temporary tarballs after ${fail ? 'failure' : 'success'}`, async (t) => {
    const evidence = await fixture(t)
    await writeFile(path.join(evidence, 'results.json'), 'retained')
    let temporary
    const operation = withTemporaryDirectory('core-compat-cleanup-', async (directory) => {
      temporary = directory
      await writeFile(path.join(directory, 'package.tgz'), 'temporary')
      if (fail)
        throw new Error('fixture failure')
      return 42
    })
    if (fail)
      await assert.rejects(operation, /fixture failure/)
    else
      assert.equal(await operation, 42)
    await assert.rejects(readdir(temporary), { code: 'ENOENT' })
    assert.equal(await readFile(path.join(evidence, 'results.json'), 'utf8'), 'retained')
  })
}

for (const packed of [false, true]) {
  test(`${packed ? 'packed' : 'registry'} CLI rejects reused evidence before work`, async (t) => {
    const root = await fixture(t)
    await writeFile(path.join(root, 'results.json'), 'previous evidence')
    const script = packed ? './test-core-compat-packed.mjs' : './test-core-compat.mjs'
    const args = packed ? [root] : ['0.0.1-beta.17', root]
    const result = spawnSync(process.execPath, [fileURLToPath(new URL(script, import.meta.url)), ...args], { encoding: 'utf8', timeout: 10000 })
    assert.equal(result.status, 1)
    assert.match(result.stderr, /Evidence directory must be empty/)
    assert.equal(await readFile(path.join(root, 'results.json'), 'utf8'), 'previous evidence')
    assert.deepEqual(await readdir(root), ['results.json'])
  })
}

test('requires an explicit workspace Node policy before installation', () => {
  assert.equal(requireNodePolicy({ engines: { node: '>=22.22.3' } }), '>=22.22.3')
  for (const workspace of [{}, { engines: {} }, { engines: { node: '' } }, { engines: { node: ' ' } }])
    assert.throws(() => requireNodePolicy(workspace), /Workspace package.json.*engines.node/)
})

test('retains artifact integrity independently of a temporary tarball path', () => {
  const artifact = { resolved: 'file:/removed/package.tgz', integrity: 'sha512-Zml4dHVyZQ==', version: '0.0.1-beta.17' }
  const lock = { packages: { 'node_modules/@destyler-ui/vue': artifact } }
  assert.deepEqual(getArtifactIdentity(lock, '@destyler-ui/vue'), { resolved: artifact.resolved, integrity: artifact.integrity })
  assert.throws(() => getArtifactIdentity({ packages: {} }, '@destyler-ui/vue'), /integrity recorded/)
  assert.throws(() => getArtifactIdentity({ packages: { 'node_modules/@destyler-ui/vue': { integrity: artifact.integrity } } }, '@destyler-ui/vue'), /resolved artifact/)
})
