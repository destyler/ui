import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { copyFileSync, mkdirSync, readFileSync, realpathSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join, resolve } from 'node:path'
import process from 'node:process'
import { pathToFileURL } from 'node:url'

export const coreSha = '691bcbd43030ba4db4980a8d910e032a947ce01e'
export const uiBase = '957dd2f68de7ed6cb0431822ddc3d84479c311bc'
const sourceBlobs = {
  'packages/components/presence/src/machine.ts': '4f86ffbfda0054564cb2e50355b94920f4c1ab86',
  'packages/components/presence/test/presence.test.ts': '050b0b7519cd348b02daee200f004266aa9d77b3',
}
const protectedFiles = ['package.json', 'pnpm-workspace.yaml', 'pnpm-lock.yaml', 'packages/solid/package.json']
const hash = (data, algorithm = 'sha256') => createHash(algorithm).update(data).digest('hex')
const read = file => readFileSync(file, 'utf8')
const git = (cwd, ...args) => execFileSync('git', args, { cwd, encoding: 'utf8' }).trim()
const run = (cwd, ...args) => execFileSync('pnpm', args, { cwd, stdio: 'inherit' })
const save = (directory, name, value) => writeFileSync(join(directory, name), `${JSON.stringify(value, null, 2)}\n`)

export function unchangedDependencies(lock) {
  // Compare the entire pnpm lock, including importers and catalogs. Drop only
  // exact Presence keys and their nested values, never another package's entry.
  assert.match(lock, /^lockfileVersion: '9\.0'/)
  const retained = []
  let removedIndent
  for (const line of lock.split('\n')) {
    if (!line.trim())
      continue
    const indent = line.match(/^ */)[0].length
    if (removedIndent !== undefined && indent > removedIndent)
      continue
    removedIndent = undefined
    if (/^\s*['"]@destyler\/presence(?:@[^'"]+)?['"]:/.test(line)) {
      removedIndent = indent
      continue
    }
    retained.push(line)
  }
  return retained.join('\n')
}

export function consumerLock(lock, integrity) {
  assert.match(integrity, /^sha512-[A-Za-z0-9+/]+={0,2}$/)
  const [prefix, rest] = lock.split('\npackages:\n')
  const [packages, snapshots] = rest.split('\nsnapshots:\n')
  const marker = '\n  packages/solid:\n'
  const start = prefix.indexOf(marker)
  assert.ok(start >= 0, 'Solid importer is missing')
  const next = prefix.slice(start + marker.length).search(/\n {2}\S/)
  const end = next < 0 ? prefix.length : start + marker.length + next
  const importer = prefix.slice(start, end)
  const original = '      \'@destyler/presence\':\n        specifier: catalog:prod\n        version: 0.2.9'
  assert.equal(importer.split(original).length, 2, 'expected one published Solid Presence importer')
  const replaced = importer.replace(original, '      \'@destyler/presence\':\n        specifier: file:../../.temp/presence.tgz\n        version: file:.temp/presence.tgz')
  const packageMarker = '  \'@destyler/presence@0.2.9\':'
  assert.equal(packages.split(packageMarker).length, 2, 'expected published Presence resolution')
  const candidatePackage = `  '@destyler/presence@file:.temp/presence.tgz':
    resolution: {integrity: ${integrity}, tarball: file:.temp/presence.tgz}
    version: 0.2.9

`
  const snapshot = snapshots.match(/ {2}'@destyler\/presence@0\.2\.9':\n[\s\S]*?(?=\n {2}\S|$)/)?.[0]
  assert.ok(snapshot, 'expected published Presence dependency snapshot')
  const candidateSnapshot = snapshot.replace(packageMarker, '  \'@destyler/presence@file:.temp/presence.tgz\':')
  const result = `${prefix.slice(0, start)}${replaced}${prefix.slice(end)}\npackages:\n${packages.replace(packageMarker, candidatePackage + packageMarker)}\nsnapshots:\n${snapshots.replace(snapshot, `${snapshot}\n${candidateSnapshot}`)}`
  assert.equal(unchangedDependencies(result), unchangedDependencies(lock), 'unrelated lock entries moved')
  return result
}

function installed(ui) {
  const entry = realpathSync(createRequire(join(ui, 'packages/solid/package.json')).resolve('@destyler/presence'))
  const directory = dirname(dirname(entry))
  const manifest = JSON.parse(read(join(directory, 'package.json')))
  assert.equal(manifest.name, '@destyler/presence')
  assert.equal(manifest.version, '0.2.9')
  assert.equal(manifest.exports['.'], './dist/index.mjs')
  assert.equal(entry, join(directory, 'dist/index.mjs'))
  return { entry, manifest, entrySha256: hash(readFileSync(entry)) }
}

function fingerprint(ui) {
  return Object.fromEntries(protectedFiles.map(file => [file, hash(readFileSync(join(ui, file)))]))
}

function baseline(ui, evidence) {
  git(ui, 'merge-base', '--is-ancestor', uiBase, 'HEAD')
  assert.equal(git(ui, 'diff', '--name-only', 'HEAD', '--', ...protectedFiles), '')
  const originalTourTest = 'packages/solid/src/components/tour/test/tour.test.tsx'
  const originalTourTestBlob = git(ui, 'rev-parse', `${uiBase}:${originalTourTest}`)
  assert.equal(git(ui, 'hash-object', originalTourTest), originalTourTestBlob, 'original Tour assertions changed')
  const lock = read(join(ui, 'pnpm-lock.yaml'))
  assert.match(lock, /'@destyler\/presence@0\.2\.9':\n {4}resolution: \{integrity: sha512-/)
  assert.doesNotMatch(lock, /@destyler\/presence@file:/)
  const artifact = installed(ui)
  save(evidence, 'registry-provenance.json', {
    uiCommit: git(ui, 'rev-parse', 'HEAD'),
    uiBase,
    originalTourTestBlob,
    protectedFiles: fingerprint(ui),
    ...artifact,
  })
  console.log('Registry negative control:', JSON.stringify(artifact))
}

function pack(core, evidence) {
  assert.equal(git(core, 'rev-parse', 'HEAD'), coreSha)
  assert.equal(git(core, 'status', '--porcelain', '--untracked-files=no'), '')
  for (const [file, blob] of Object.entries(sourceBlobs))
    assert.equal(git(core, 'hash-object', file), blob, `unreviewed core source: ${file}`)
  const lockSha256 = hash(readFileSync(join(core, 'pnpm-lock.yaml')))
  run(core, '--filter', '@destyler/presence...', 'run', 'build')
  const directory = join(core, 'packages/components/presence')
  run(directory, 'pack', '--pack-destination', evidence)
  const archive = join(evidence, 'destyler-presence-0.2.9.tgz')
  const bytes = readFileSync(archive)
  const extract = file => execFileSync('tar', ['-xOf', archive, `package/${file}`])
  const manifest = JSON.parse(extract('package.json'))
  assert.equal(manifest.name, '@destyler/presence')
  assert.equal(manifest.version, '0.2.9')
  assert.deepEqual(manifest.dependencies, { '@destyler/types': '0.2.9', '@destyler/xstate': '0.2.9' })
  const entrySha256 = hash(extract('dist/index.mjs'))
  assert.equal(entrySha256, hash(readFileSync(join(directory, 'dist/index.mjs'))))
  assert.equal(hash(extract('dist/index.d.mts')), hash(readFileSync(join(directory, 'dist/index.d.mts'))))
  assert.equal(hash(readFileSync(join(core, 'pnpm-lock.yaml'))), lockSha256)
  save(evidence, 'candidate-provenance.json', {
    coreCommit: coreSha,
    sourceBlobs,
    lockSha256,
    node: process.version,
    packageManager: JSON.parse(read(join(core, 'package.json'))).packageManager,
    archive,
    archiveSha256: hash(bytes),
    archiveIntegrity: `sha512-${createHash('sha512').update(bytes).digest('base64')}`,
    entrySha256,
    manifest,
  })
  console.log('Packed candidate:', read(join(evidence, 'candidate-provenance.json')))
}

function consumer(ui, isolated, evidence) {
  assert.notEqual(realpathSync(ui), realpathSync(isolated), 'candidate must use an isolated checkout')
  const registry = JSON.parse(read(join(evidence, 'registry-provenance.json')))
  assert.deepEqual(fingerprint(ui), registry.protectedFiles, 'production dependency files changed')
  assert.deepEqual(fingerprint(isolated), registry.protectedFiles, 'consumer must begin from the same frozen dependencies')
  assert.equal(git(isolated, 'rev-parse', 'HEAD'), registry.uiCommit)
  const candidate = JSON.parse(read(join(evidence, 'candidate-provenance.json')))
  assert.equal(candidate.coreCommit, coreSha)
  assert.equal(hash(readFileSync(candidate.archive)), candidate.archiveSha256)
  const solidManifestPath = join(isolated, 'packages/solid/package.json')
  const solidManifest = JSON.parse(read(solidManifestPath))
  assert.equal(solidManifest.dependencies['@destyler/presence'], 'catalog:prod')
  mkdirSync(join(isolated, '.temp'), { recursive: true })
  copyFileSync(candidate.archive, join(isolated, '.temp/presence.tgz'))
  solidManifest.dependencies['@destyler/presence'] = 'file:../../.temp/presence.tgz'
  writeFileSync(solidManifestPath, `${JSON.stringify(solidManifest, null, 2)}\n`)
  // Construct an isolated lock from the existing frozen graph. Only this
  // importer's Presence edge and its local archive resolution/snapshot are added.
  // pnpm's frozen installer must independently accept the graph and integrity.
  const candidateLock = consumerLock(read(join(ui, 'pnpm-lock.yaml')), candidate.archiveIntegrity)
  writeFileSync(join(isolated, 'pnpm-lock.yaml'), candidateLock)
  writeFileSync(join(evidence, 'candidate-consumer-lock.yaml'), candidateLock)
  writeFileSync(join(evidence, 'candidate-consumer-solid-package.json'), read(solidManifestPath))
  run(isolated, 'install', '--offline', '--frozen-lockfile')
  assert.equal(read(join(isolated, 'pnpm-lock.yaml')), candidateLock, 'frozen installer changed the lock')
  const artifact = installed(isolated)
  assert.equal(artifact.entrySha256, candidate.entrySha256, 'installed entry differs from built and packed candidate')
  assert.deepEqual(artifact.manifest, candidate.manifest)
  assert.deepEqual(fingerprint(ui), registry.protectedFiles, 'production dependency files changed')
  save(evidence, 'consumer-provenance.json', {
    uiCommit: registry.uiCommit,
    coreCommit: coreSha,
    archiveSha256: candidate.archiveSha256,
    lockSha256: hash(candidateLock),
    ...artifact,
  })
  console.log('Installed candidate:', read(join(evidence, 'consumer-provenance.json')))
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const [, , mode, input, output, extra] = process.argv
  const evidence = resolve(output)
  mkdirSync(evidence, { recursive: true })
  if (mode === 'baseline')
    baseline(resolve(input), evidence)
  else if (mode === 'pack')
    pack(resolve(input), evidence)
  else if (mode === 'consumer')
    consumer(resolve(input), resolve(extra), evidence)
  else
    throw new Error(`Unknown preparation mode: ${mode}`)
}
