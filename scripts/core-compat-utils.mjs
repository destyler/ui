import assert from 'node:assert/strict'
import { lstat, mkdir, mkdtemp, readdir, realpath, rm, stat } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'

export async function prepareEvidenceDirectory(directory) {
  await mkdir(directory, { recursive: true })
  assert.equal((await readdir(directory)).length, 0, `Evidence directory must be empty: ${directory}. Choose a fresh directory; existing evidence will not be overwritten.`)
  return realpath(directory)
}

export async function assertInstalledArtifact(installed, consumer) {
  assert.equal((await lstat(installed)).isSymbolicLink(), false, 'Install the tarball, never a workspace symlink')
  // Canonicalize both sides: /tmp and TMPDIR may be symlinked on macOS.
  const relative = path.relative(await realpath(consumer), await realpath(installed))
  assert.ok(relative && relative !== '..' && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative), 'Must consume installed artifact inside the consumer, not workspace source')
}

export async function requireTarball(source, framework, version) {
  const filename = path.resolve(source, `destyler-ui-${framework}-${version}.tgz`)
  const info = await stat(filename).catch((error) => {
    if (error.code === 'ENOENT')
      throw new Error(`Missing packed UI tarball: ${filename}. Build and pack the matching checkout first.`)
    throw error
  })
  assert.ok(info.isFile(), `Expected a packed UI tarball file: ${filename}`)
  return filename
}

export function assertCoreVersions(resolvedCore, core) {
  for (const [key, version] of Object.entries(resolvedCore)) {
    assert.equal(version, core, `${key} resolved ${version}, expected exact core ${core}. Check the consumer overrides and transitive @destyler dependencies; do not accept a different version as tested.`)
  }
}

export async function withTemporaryDirectory(prefix, action) {
  const directory = await mkdtemp(path.join(tmpdir(), prefix))
  try {
    return await action(directory)
  }
  finally {
    // Only our freshly created tarball directory, never caller-owned evidence.
    await rm(directory, { recursive: true, force: true })
  }
}

export function requireNodePolicy(workspace) {
  const node = workspace.engines?.node
  assert.ok(typeof node === 'string' && node.trim(), 'Workspace package.json must declare a non-empty engines.node support policy before running core compatibility checks')
  return node
}

export function getArtifactIdentity(lock, packageName) {
  const artifact = lock.packages?.[`node_modules/${packageName}`]
  assert.ok(typeof artifact?.integrity === 'string' && artifact.integrity, `${packageName} must have integrity recorded in the consumer lockfile`)
  assert.ok(typeof artifact.resolved === 'string' && artifact.resolved, `${packageName} must have a resolved artifact recorded in the consumer lockfile`)
  return { resolved: artifact.resolved, integrity: artifact.integrity }
}
