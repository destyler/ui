import { Buffer } from 'node:buffer'
import { spawnSync } from 'node:child_process'
import { lstatSync, readdirSync, readFileSync, realpathSync } from 'node:fs'
import { dirname, isAbsolute, join, resolve } from 'node:path'
import process from 'node:process'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { TextDecoder } from 'node:util'

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const policyPath = 'scripts/publish-targets.json'
const workspacePatterns = ['docs', 'packages/*', 'utils', 'tooling/*']
// Independent scope anchors: editing the JSON alone cannot widen the release.
const publicPairs = [
  ['packages/react', '@destyler-ui/react'],
  ['packages/solid', '@destyler-ui/solid'],
  ['packages/svelte', '@destyler-ui/svelte'],
  ['packages/vue', '@destyler-ui/vue'],
]
const privatePairs = [
  ['.', '@destyler-ui/monorepo'],
  ['docs', '@destyler-ui/docs'],
  ['utils', '@destyler-ui/private'],
  ['tooling/eslint-react-compat', '@destyler-ui/eslint-react-compat'],
  ['tooling/eslint-solid', '@destyler-ui/eslint-solid'],
]
const versionPattern = /^(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)(?:-(?:0|[1-9]\d*|\d*[a-zA-Z-][\da-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][\da-zA-Z-]*))*)?(?:\+[\da-zA-Z-]+(?:\.[\da-zA-Z-]+)*)?$/u

function validVersion(value) {
  if (typeof value !== 'string' || value.length > 256 || !versionPattern.test(value))
    return false
  return value.split(/[.+-]/u).slice(0, 3).every(part => Number.isSafeInteger(Number(part)))
}

function requireCondition(condition, message) {
  if (!condition)
    throw new Error(`Publish scope: ${message}`)
}

function isRecord(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

function sameKeys(value, keys) {
  return isRecord(value) && JSON.stringify(Object.keys(value).sort()) === JSON.stringify([...keys].sort())
}

function parseJson(source, label) {
  let value
  try {
    value = JSON.parse(source)
  }
  catch {
    throw new Error(`Publish scope: invalid JSON in ${label}`)
  }
  // JSON.parse otherwise silently accepts duplicate (including escaped) keys.
  const stack = []
  for (const [token] of source.matchAll(/"(?:\\.|[^"\\])*"|[{}[\],:]/gu)) {
    if (token === '{') {
      stack.push({ keys: new Set(), expectsKey: true })
    }
    else if (token === '[') {
      stack.push(null)
    }
    else if (token === '}' || token === ']') {
      stack.pop()
    }
    else if (token === ',' && stack.at(-1)) {
      stack.at(-1).expectsKey = true
    }
    else if (token.startsWith('"') && stack.at(-1)?.expectsKey) {
      const context = stack.at(-1)
      const key = JSON.parse(token)
      requireCondition(!context.keys.has(key), `duplicate JSON key in ${label}`)
      context.keys.add(key)
      context.expectsKey = false
    }
  }
  return value
}

function checkedPath(root, relativePath, kind, optional = false) {
  const parts = relativePath === '.' ? [] : relativePath.split('/')
  requireCondition(parts.every(part => part && part !== '.' && part !== '..' && !part.includes('\\')), `unsafe path: ${relativePath}`)
  let current = root
  for (let i = 0; i <= parts.length; i++) {
    if (i)
      current = join(current, parts[i - 1])
    const stat = lstatSync(current, { throwIfNoEntry: false })
    if (!stat && optional && i === parts.length)
      return null
    requireCondition(stat, `missing ${relativePath}`)
    requireCondition(!stat.isSymbolicLink(), `symlink is not allowed: ${relativePath}`)
    const isDirectory = i < parts.length || kind === 'directory'
    requireCondition(isDirectory ? stat.isDirectory() : stat.isFile(), `expected ${isDirectory ? 'directory' : 'regular file'}: ${relativePath}`)
  }
  return current
}

function decodeUtf8(bytes, label) {
  try {
    return new TextDecoder('utf-8', { fatal: true, ignoreBOM: true }).decode(bytes)
  }
  catch {
    throw new Error(`Publish scope: invalid UTF-8 in ${label}`)
  }
}

function readChecked(root, relativePath) {
  return decodeUtf8(readFileSync(checkedPath(root, relativePath, 'file')), relativePath)
}

function validatePolicy(policy) {
  requireCondition(sameKeys(policy, ['schemaVersion', 'workspacePatterns', 'publicPackages', 'privatePackages']), 'invalid policy schema')
  requireCondition(policy.schemaVersion === 1, 'unsupported policy version')
  requireCondition(JSON.stringify(policy.workspacePatterns) === JSON.stringify(workspacePatterns), 'policy workspace patterns changed')
  for (const [key, pairs] of [['publicPackages', publicPairs], ['privatePackages', privatePairs]]) {
    const entries = policy[key]
    requireCondition(Array.isArray(entries) && entries.length === pairs.length, `invalid policy ${key} count`)
    for (let i = 0; i < pairs.length; i++) {
      requireCondition(sameKeys(entries[i], ['path', 'name']), `invalid policy ${key} entry`)
      requireCondition(entries[i].path === pairs[i][0] && entries[i].name === pairs[i][1], `policy ${key} path/name allowlist changed`)
    }
  }
}

function validateWorkspace(source) {
  // Intentionally support the reviewed YAML subset, not an approximate glob or
  // YAML implementation. A topology/configuration change requires guard review.
  requireCondition(!/[\r\u0085\u2028\u2029]/u.test(source.replaceAll('\r\n', '\n')), 'unsupported workspace YAML line endings')
  const allowedKeys = new Set(['packages', 'catalogMode', 'catalogs', 'onlyBuiltDependencies', 'shellEmulator', 'patchedDependencies'])
  const seenKeys = new Set()
  const patterns = []
  let key
  for (const line of source.replaceAll('\r\n', '\n').split('\n')) {
    requireCondition(!line.includes('\t'), 'tabs are not supported in workspace YAML')
    if (!line.trim() || line.trimStart().startsWith('#'))
      continue
    if (!line.startsWith(' ')) {
      const match = /^([a-zA-Z][a-zA-Z\d]*):(?: .*)?$/u.exec(line)
      requireCondition(match && allowedKeys.has(match[1]), 'unsupported workspace YAML key or syntax')
      key = match[1]
      requireCondition(!seenKeys.has(key), `duplicate workspace key: ${key}`)
      seenKeys.add(key)
      if (key === 'packages')
        requireCondition(line === 'packages:', 'workspace packages must be a block list')
    }
    else if (key === 'packages') {
      const match = /^ {2}- ([a-z/*]+)$/u.exec(line)
      requireCondition(match, 'unsupported workspace package pattern syntax')
      patterns.push(match[1])
    }
    else {
      requireCondition(key, 'workspace YAML must start with a top-level key')
    }
  }
  requireCondition(JSON.stringify(patterns) === JSON.stringify(workspacePatterns), 'workspace patterns must exactly match the policy')
}

function rejectAlternateManifests(root, path) {
  for (const filename of ['package.json5', 'package.yaml', 'package.yml']) {
    const relativePath = path === '.' ? filename : `${path}/${filename}`
    requireCondition(!checkedPath(root, relativePath, 'file', true), `alternate workspace manifest is not allowed: ${relativePath}`)
  }
}

function discoverWorkspaces(root) {
  for (const path of ['.', 'docs', 'utils'])
    rejectAlternateManifests(root, path)
  const paths = ['.', 'docs', 'utils']
  for (const parent of ['packages', 'tooling']) {
    const directory = checkedPath(root, parent, 'directory')
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      requireCondition(!entry.isSymbolicLink(), `symlink is not allowed: ${parent}/${entry.name}`)
      if (!entry.isDirectory())
        continue
      const path = `${parent}/${entry.name}`
      rejectAlternateManifests(root, path)
      if (checkedPath(root, `${path}/package.json`, 'file', true))
        paths.push(path)
    }
  }
  const expected = [...publicPairs, ...privatePairs].map(([path]) => path).sort()
  requireCondition(JSON.stringify(paths.sort()) === JSON.stringify(expected), 'workspace inventory must contain exactly the nine allowlisted paths')
  return paths
}

export function validatePublishScope(root = repositoryRoot) {
  root = resolve(root)
  requireCondition(realpathSync(root) === root, 'repository root must be canonical and not symlinked')
  checkedPath(root, '.', 'directory')
  const policySource = readChecked(root, policyPath)
  const policy = parseJson(policySource, policyPath)
  validatePolicy(policy)
  const workspaceSource = readChecked(root, 'pnpm-workspace.yaml')
  validateWorkspace(workspaceSource)
  const paths = discoverWorkspaces(root)
  const manifests = []
  const inventory = paths.map((path) => {
    const manifestPath = path === '.' ? 'package.json' : `${path}/package.json`
    const source = readChecked(root, manifestPath)
    manifests.push([manifestPath, source])
    const manifest = parseJson(source, manifestPath)
    requireCondition(isRecord(manifest), `manifest must be an object: ${manifestPath}`)
    const publicEntry = policy.publicPackages.find(entry => entry.path === path)
    const expected = publicEntry ?? policy.privatePackages.find(entry => entry.path === path)
    requireCondition(manifest.name === expected.name, `unexpected package name at ${path}`)
    if (publicEntry) {
      requireCondition(manifest.private === undefined || manifest.private === false, `public package has invalid private field: ${path}`)
      requireCondition(sameKeys(manifest.publishConfig, ['access']) && manifest.publishConfig.access === 'public', `publishConfig must be exactly public access: ${path}`)
    }
    else {
      requireCondition(manifest.private === true, `private must be boolean true: ${path}`)
    }
    if (publicEntry || path === '.' || manifest.version !== undefined)
      requireCondition(validVersion(manifest.version), `invalid package version: ${path}`)
    return { path, name: manifest.name, version: manifest.version, private: manifest.private === true }
  })
  const version = inventory.find(entry => entry.path === '.').version
  const targets = policy.publicPackages.map(({ path }) => inventory.find(entry => entry.path === path))
  requireCondition(targets.every(entry => entry.version === version), 'public package versions must match the root release version')
  return {
    root,
    version,
    targets,
    inventory,
    snapshot: JSON.stringify([policySource, workspaceSource, manifests]),
  }
}

function checkedCommand(runCommand, args, root, label, inherit = false) {
  const result = runCommand('pnpm', args, {
    cwd: root,
    shell: false,
    ...(inherit ? { stdio: 'inherit' } : { maxBuffer: 4 * 1024 * 1024 }),
  })
  requireCondition(result && !result.error && !result.signal && result.status === 0, `${label} failed; refusing to continue`)
  return result.stdout
}

function validateSelection(source, expected, root, label) {
  if (Buffer.isBuffer(source))
    source = decodeUtf8(source, label)
  requireCondition(typeof source === 'string', `${label} did not return JSON text`)
  const entries = parseJson(source, label)
  requireCondition(Array.isArray(entries) && entries.length === expected.length, `${label} package count mismatch`)
  const names = new Set()
  const paths = new Set()
  for (const entry of entries) {
    requireCondition(isRecord(entry), `${label} contains an invalid package`)
    const match = expected.find(candidate => candidate.name === entry.name)
    requireCondition(match, `${label} contains an unexpected package name`)
    requireCondition(typeof entry.path === 'string' && isAbsolute(entry.path) && entry.path === resolve(root, match.path), `${label} package path mismatch`)
    requireCondition(!names.has(entry.name) && !paths.has(entry.path), `${label} contains duplicate packages`)
    requireCondition(entry.version === match.version, `${label} package version mismatch`)
    requireCondition(entry.private === undefined || typeof entry.private === 'boolean', `${label} has a non-boolean private field`)
    requireCondition((entry.private === true) === match.private, `${label} package privacy mismatch`)
    names.add(entry.name)
    paths.add(entry.path)
  }
}

function verifyUnchanged(before) {
  const after = validatePublishScope(before.root)
  requireCondition(after.snapshot === before.snapshot, 'policy or workspace inventory changed during pnpm discovery')
}

export function runPublish({ root = repositoryRoot, argv = [], runCommand = spawnSync, log = console.log } = {}) {
  requireCondition(Array.isArray(argv) && (argv.length === 0 || (argv.length === 1 && ['--check', '--publish'].includes(argv[0]))), 'use no arguments or --check (offline), or explicit --publish; no other arguments are allowed')
  const scope = validatePublishScope(root)
  if (argv[0] !== '--publish') {
    log(`Publish scope OK (offline): ${scope.inventory.length} workspaces, ${scope.targets.length} public targets at ${scope.version}. No package manager or lifecycle scripts executed.`)
    return scope
  }

  const inventory = checkedCommand(runCommand, ['-r', '--include-workspace-root', 'list', '--depth', '-1', '--json'], scope.root, 'pnpm workspace discovery')
  verifyUnchanged(scope)
  validateSelection(inventory, scope.inventory, scope.root, 'pnpm workspace discovery')
  const filters = scope.targets.flatMap(({ name }) => ['--filter', name])
  const selection = checkedCommand(runCommand, [...filters, '-r', 'list', '--depth', '-1', '--json'], scope.root, 'pnpm target discovery')
  // Never trust the pre-discovery snapshot after executing an external program.
  verifyUnchanged(scope)
  validateSelection(selection, scope.targets, scope.root, 'pnpm target discovery')
  checkedCommand(runCommand, [...filters, '-r', 'publish', '--access', 'public', '--no-git-checks'], scope.root, 'pnpm publish', true)
  return scope
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    runPublish({ argv: process.argv.slice(2) })
  }
  catch (error) {
    console.error(error.message)
    process.exitCode = 1
  }
}
