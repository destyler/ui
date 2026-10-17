import assert from 'node:assert/strict'
import { Buffer } from 'node:buffer'
import { spawnSync } from 'node:child_process'
import { chmodSync, copyFileSync, mkdirSync, mkdtempSync, readFileSync, realpathSync, renameSync, rmSync, symlinkSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { delimiter, dirname, join, resolve } from 'node:path'
import process from 'node:process'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'
import { runPublish, validatePublishScope } from './publish-packages.mjs'

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
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
const allPairs = [...publicPairs, ...privatePairs]
const version = '0.0.1-beta.17'
const policyPath = 'scripts/publish-targets.json'
const filters = publicPairs.flatMap(([, name]) => ['--filter', name])
const listArgs = ['-r', '--include-workspace-root', 'list', '--depth', '-1', '--json']
const selectedArgs = [...filters, '-r', 'list', '--depth', '-1', '--json']
const publishArgs = [...filters, '-r', 'publish', '--access', 'public', '--no-git-checks']

function writeJson(root, path, value) {
  const target = join(root, path)
  mkdirSync(dirname(target), { recursive: true })
  writeFileSync(target, `${JSON.stringify(value, null, 2)}\n`)
}

function editJson(root, path, edit) {
  const value = JSON.parse(readFileSync(join(root, path), 'utf8'))
  edit(value)
  writeJson(root, path, value)
}

function manifestPath(path) {
  return path === '.' ? 'package.json' : `${path}/package.json`
}

function fixture(t) {
  const root = realpathSync(mkdtempSync(join(tmpdir(), 'destyler-publish-')))
  t.after(() => rmSync(root, { recursive: true, force: true }))
  mkdirSync(join(root, 'scripts'))
  copyFileSync(join(repositoryRoot, policyPath), join(root, policyPath))
  copyFileSync(join(repositoryRoot, 'scripts/publish-packages.mjs'), join(root, 'scripts/publish-packages.mjs'))
  writeFileSync(join(root, 'pnpm-workspace.yaml'), 'packages:\n  - docs\n  - packages/*\n  - utils\n  - tooling/*\n')
  for (const [path, name] of allPairs) {
    const isPrivate = privatePairs.some(([entry]) => entry === path)
    writeJson(root, manifestPath(path), {
      name,
      ...(path === '.' || !isPrivate ? { version } : {}),
      ...(isPrivate ? { private: true } : { publishConfig: { access: 'public' } }),
      // These must never execute in a validation or mocked publish test.
      scripts: { prepublishOnly: 'DO_NOT_EXECUTE_LIFECYCLES', prepack: 'DO_NOT_EXECUTE_LIFECYCLES' },
    })
  }
  return root
}

function records(root, pairs) {
  return pairs.map(([path]) => {
    const manifest = JSON.parse(readFileSync(join(root, manifestPath(path)), 'utf8'))
    return { name: manifest.name, version: manifest.version, path: resolve(root, path), private: manifest.private === true }
  })
}

function stub(root, intercept) {
  // A plain function, never an executable or a package-manager process. Freeze
  // discovery output before mutations so tests cannot hide a TOCTOU failure.
  const inventory = records(root, allPairs)
  const targets = records(root, publicPairs)
  const calls = []
  const command = (program, args, options) => {
    calls.push({ program, args: [...args], options: { ...options } })
    assert.equal(program, 'pnpm')
    assert.equal(options.shell, false)
    assert.equal(options.cwd, root)
    const response = { status: 0, signal: null, stdout: JSON.stringify(args.includes('--filter') ? targets : inventory), stderr: '' }
    return intercept?.({ args, call: calls.length, response }) ?? response
  }
  return { command, calls, publishes: () => calls.filter(({ args }) => args.includes('publish')).length }
}

function rejected(root, { intercept, calls, pattern = /Publish scope:/u } = {}) {
  const runner = stub(root, intercept)
  assert.throws(() => runPublish({ root, argv: ['--publish'], runCommand: runner.command, log() {} }), pattern)
  assert.equal(runner.publishes(), 0, 'every validation rejection must make zero publish calls')
  if (calls !== undefined)
    assert.equal(runner.calls.length, calls)
  return runner
}

function editManifest(root, path, key, value) {
  editJson(root, manifestPath(path), (manifest) => {
    if (value === undefined)
      delete manifest[key]
    else
      manifest[key] = value
  })
}

test('repository has exactly nine workspaces and only the four reviewed public targets', () => {
  const scope = validatePublishScope(repositoryRoot)
  assert.equal(scope.inventory.length, 9)
  assert.deepEqual(scope.targets.map(({ path, name }) => [path, name]), publicPairs)
  assert.deepEqual(scope.inventory.filter(entry => entry.private).map(({ path, name }) => [path, name]).sort(), [...privatePairs].sort())
})

for (const argv of [[], ['--check']]) {
  test(`offline ${JSON.stringify(argv)} never starts pnpm or lifecycle scripts`, (t) => {
    const root = fixture(t)
    const runner = stub(root)
    const messages = []
    const scope = runPublish({ root, argv, runCommand: runner.command, log: message => messages.push(message) })
    assert.equal(scope.inventory.length, 9)
    assert.equal(runner.calls.length, 0)
    assert.match(messages[0], /offline.*9 workspaces, 4 public targets/u)
  })
}

test('only explicit publish mode dispatches the exact checked selection, preserving lifecycle semantics and flags', (t) => {
  const root = fixture(t)
  const runner = stub(root)
  runPublish({ root, argv: ['--publish'], runCommand: runner.command })
  assert.deepEqual(runner.calls.map(({ args }) => args), [listArgs, selectedArgs, publishArgs])
  assert.equal(runner.publishes(), 1)
  assert.equal(runner.calls[2].options.stdio, 'inherit')
  assert.ok(runner.calls.every(({ args }) => !args.includes('--ignore-scripts') && !args.includes('--dry-run')))
})

test('valid reordered pnpm inventory is accepted without changing publish selectors', (t) => {
  const root = fixture(t)
  const runner = stub(root, ({ response }) => ({ ...response, stdout: JSON.stringify(JSON.parse(response.stdout).reverse()) }))
  runPublish({ root, argv: ['--publish'], runCommand: runner.command })
  assert.deepEqual(runner.calls.at(-1).args, publishArgs)
})

for (const argv of [['--dry-run'], ['--publish', '--check'], ['--check', '--publish'], ['--publish', '--publish'], ['--publish', '--filter', '*'], ['--publish=true'], ['publish'], [''], ['--'], [null], '--publish']) {
  test(`reject unexpected mode/argument ${JSON.stringify(argv)} before any command`, (t) => {
    const root = fixture(t)
    const runner = stub(root)
    assert.throws(() => runPublish({ root, argv, runCommand: runner.command }), /no other arguments/u)
    assert.equal(runner.calls.length, 0)
    assert.equal(runner.publishes(), 0)
  })
}

for (const [path] of privatePairs) {
  for (const value of [undefined, 'true', 'false', false, null, 0, 1, {}, []]) {
    test(`reject non-boolean-true privacy at ${path}: ${JSON.stringify(value)}`, (t) => {
      const root = fixture(t)
      editManifest(root, path, 'private', value)
      rejected(root, { calls: 0, pattern: /private must be boolean true/u })
    })
  }
}

for (const [path] of publicPairs) {
  for (const value of [true, 'true', 'false', null, 0, 1, {}, []]) {
    test(`reject invalid public privacy at ${path}: ${JSON.stringify(value)}`, (t) => {
      const root = fixture(t)
      editManifest(root, path, 'private', value)
      rejected(root, { calls: 0, pattern: /public package has invalid private field/u })
    })
  }
  test(`explicit false privacy is accepted at ${path}`, (t) => {
    const root = fixture(t)
    editManifest(root, path, 'private', false)
    assert.equal(validatePublishScope(root).targets.length, 4)
  })
}

for (const [path] of allPairs) {
  test(`reject changed/missing identity at ${path}`, (t) => {
    const root = fixture(t)
    editManifest(root, path, 'name', '@destyler-ui/unreviewed')
    rejected(root, { calls: 0, pattern: /unexpected package name/u })
  })
}

for (const value of [undefined, null, 42, {}, [], '', '*', '@destyler-ui/react...', '@destyler-ui/solid']) {
  test(`reject malformed or duplicate package name ${JSON.stringify(value)}`, (t) => {
    const root = fixture(t)
    editManifest(root, 'packages/react', 'name', value)
    rejected(root, { calls: 0 })
  })
}

for (const value of [undefined, null, 1, [], {}, '', 'latest', '^1.0.0', '1.0', 'v1.0.0', '01.0.0', '1.01.0', '1.0.01', '1.0.0-01', '1.0.0-beta.01', '1.0.0-', '1.0.0+', '1.0.0 ', '1.0.0\n', '1.0.0-beta..1', '1.0.0-K', '1.0.0-ſ', '9007199254740992.0.0', '0.9007199254740992.0', '0.0.9007199254740992', `1.0.0-${'a'.repeat(251)}`]) {
  test(`reject invalid release version ${JSON.stringify(value)}`, (t) => {
    const root = fixture(t)
    editManifest(root, '.', 'version', value)
    rejected(root, { calls: 0, pattern: /invalid package version/u })
  })
}

for (const [path] of publicPairs) {
  test(`reject missing/unsynchronized public version at ${path}`, (t) => {
    const root = fixture(t)
    editManifest(root, path, 'version', '1.2.3')
    rejected(root, { calls: 0, pattern: /versions must match/u })
    editManifest(root, path, 'version', undefined)
    rejected(root, { calls: 0, pattern: /invalid package version/u })
  })
}

for (const release of ['0.0.0', '1.2.3', '1.2.3-0', '1.2.3-beta.17', '1.2.3-0a.1+Build.012', '1.2.3+build.001', '9007199254740991.0.0', '1.2.3-9007199254740992', `1.0.0-${'a'.repeat(250)}`]) {
  test(`accept synchronized semantic release version ${release}`, (t) => {
    const root = fixture(t)
    for (const [path] of [['.'], ...publicPairs])
      editManifest(root, path, 'version', release)
    assert.equal(validatePublishScope(root).version, release)
  })
}

test('private tooling versions, when present, must also be valid', (t) => {
  const root = fixture(t)
  editManifest(root, 'tooling/eslint-solid', 'version', 'not-a-version')
  rejected(root, { calls: 0, pattern: /invalid package version/u })
})

for (const value of [undefined, null, 'public', [], {}, { access: 'restricted' }, { access: true }, { access: 'public', directory: 'dist' }, { access: 'public', name: '@evil/name' }, { access: 'public', version: '9.0.0' }, { access: 'public', registry: 'https://example.invalid' }, { access: 'public', tag: 'next' }, { access: 'public', executable: true }]) {
  test(`reject publishConfig scope override ${JSON.stringify(value)}`, (t) => {
    const root = fixture(t)
    editManifest(root, 'packages/vue', 'publishConfig', value)
    rejected(root, { calls: 0, pattern: /publishConfig/u })
  })
}

const policyMutations = [
  ['schema version', policy => policy.schemaVersion = 2],
  ['string schema version', policy => policy.schemaVersion = '1'],
  ['unknown field', policy => policy.allowAll = true],
  ['missing public list', policy => delete policy.publicPackages],
  ['non-array public list', policy => policy.publicPackages = {}],
  ['empty public list', policy => policy.publicPackages = []],
  ['extra target', policy => policy.publicPackages.push({ path: 'docs', name: '@destyler-ui/docs' })],
  ['missing target', policy => policy.publicPackages.pop()],
  ['duplicate target', policy => policy.publicPackages[1] = policy.publicPackages[0]],
  ['reordered targets', policy => policy.publicPackages.reverse()],
  ['wrong name', policy => policy.publicPackages[0].name = '@destyler-ui/*'],
  ['missing name', policy => delete policy.publicPackages[0].name],
  ['unknown target field', policy => policy.publicPackages[0].private = false],
  ['null target', policy => policy.publicPackages[0] = null],
  ['traversal target', policy => policy.publicPackages[0].path = '../outside'],
  ['absolute target', policy => policy.publicPackages[0].path = '/tmp/outside'],
  ['backslash target', policy => policy.publicPackages[0].path = 'packages\\react'],
  ['root target', policy => policy.publicPackages[0].path = '.'],
  ['filter expression', policy => policy.publicPackages[0].name = '@destyler-ui/react...'],
  ['missing private list', policy => delete policy.privatePackages],
  ['missing private entry', policy => policy.privatePackages.pop()],
  ['wrong private identity', policy => policy.privatePackages[0].name = '@destyler-ui/other'],
  ['duplicate private entry', policy => policy.privatePackages[1] = policy.privatePackages[0]],
  ['invalid workspace pattern', policy => policy.workspacePatterns[1] = 'packages/**'],
]
for (const [label, mutate] of policyMutations) {
  test(`reject policy ${label} before package-manager discovery`, (t) => {
    const root = fixture(t)
    editJson(root, policyPath, mutate)
    rejected(root, { calls: 0, pattern: /policy/u })
  })
}

for (const source of ['{', 'null', '[]', 'true', '"text"', '{"schemaVersion":1,"schemaVersion":1}', '{"schemaVersion":1,"schema\\u0056ersion":1}']) {
  test(`reject malformed/duplicate policy JSON ${source}`, (t) => {
    const root = fixture(t)
    writeFileSync(join(root, policyPath), source)
    rejected(root, { calls: 0 })
  })
}

for (const source of ['{', 'null', '[]', 'true', '{"name":"@destyler-ui/docs","private":false,"private":true}', '{"name":"@destyler-ui/docs","private":false,"priva\\u0074e":true}']) {
  test(`reject malformed/duplicate manifest JSON ${source}`, (t) => {
    const root = fixture(t)
    writeFileSync(join(root, 'docs/package.json'), source)
    // Build the stub before corrupt JSON: rejection must precede invocation.
    const calls = []
    assert.throws(() => runPublish({ root, argv: ['--publish'], runCommand: (...args) => calls.push(args) }), /Publish scope:/u)
    assert.equal(calls.length, 0)
  })
}

const workspaceMutations = [
  ['recursive glob', source => source.replace('packages/*', 'packages/**')],
  ['extra glob', source => `${source}  - extras/*\n`],
  ['missing path', source => source.replace('  - docs\n', '')],
  ['negative pattern', source => source.replace('  - utils', '  - !utils')],
  ['traversal pattern', source => source.replace('  - utils', '  - ../utils')],
  ['duplicate pattern', source => `${source}  - docs\n`],
  ['quoted pattern', source => source.replace('  - docs', '  - "docs"')],
  ['flow pattern', () => 'packages: [docs, packages/*, utils, tooling/*]\n'],
  ['empty patterns', () => 'packages:\n'],
  ['alias patterns', () => 'packages: *targets\n'],
  ['duplicate key', source => `${source}packages:\n  - docs\n`],
  ['quoted key', source => `${source}"packages": [docs]\n`],
  ['merge key', source => `${source}<<: *other\n`],
  ['unknown root key', source => `${source}includeWorkspaceRoot: true\n`],
  ['document separator', source => `${source}---\npackages: []\n`],
  ['tab indentation', source => source.replace('  - docs', '\t- docs')],
  ['bare CR override', source => `${source}catalogMode: prefer\rpackages: []\n`],
  ['NEL override', source => `${source}catalogMode: prefer\u0085packages: []\n`],
  ['line-separator override', source => `${source}catalogMode: prefer\u2028packages: []\n`],
  ['paragraph-separator override', source => `${source}catalogMode: prefer\u2029packages: []\n`],
]
for (const [label, mutate] of workspaceMutations) {
  test(`reject workspace ${label} offline and before publishing`, (t) => {
    const root = fixture(t)
    const path = join(root, 'pnpm-workspace.yaml')
    writeFileSync(path, mutate(readFileSync(path, 'utf8')))
    rejected(root, { calls: 0, pattern: /workspace/u })
  })
}

test('reviewed patterns allow ordinary blank lines/comments and CRLF', (t) => {
  const root = fixture(t)
  const path = join(root, 'pnpm-workspace.yaml')
  writeFileSync(path, `# workspace\n\n${readFileSync(path, 'utf8')}`.replaceAll('\n', '\r\n'))
  assert.equal(validatePublishScope(root).inventory.length, 9)
})

for (const [path] of allPairs) {
  test(`reject missing workspace manifest ${path}`, (t) => {
    const root = fixture(t)
    const runner = stub(root)
    rmSync(join(root, manifestPath(path)))
    assert.throws(() => runPublish({ root, argv: ['--publish'], runCommand: runner.command }), /Publish scope:/u)
    assert.equal(runner.calls.length, 0)
    assert.equal(runner.publishes(), 0)
  })
}

for (const privateValue of [undefined, true]) {
  test(`reject additional ${privateValue ? 'private' : 'public'} workspace`, (t) => {
    const root = fixture(t)
    writeJson(root, 'packages/extra/package.json', { name: '@destyler-ui/extra', version, private: privateValue, publishConfig: { access: 'public' } })
    rejected(root, { calls: 0, pattern: /exactly the nine/u })
  })
}

test('non-workspace directories remain allowed; a hidden manifest does not', (t) => {
  const root = fixture(t)
  mkdirSync(join(root, 'packages/tests'))
  assert.equal(validatePublishScope(root).inventory.length, 9)
  writeJson(root, 'packages/.hidden/package.json', { name: '@destyler-ui/hidden', private: true })
  rejected(root, { calls: 0 })
})

for (const path of ['.', 'docs', 'utils', 'packages/react', 'packages/extra', 'tooling/extra']) {
  for (const filename of ['package.json5', 'package.yaml', 'package.yml']) {
    test(`reject alternate manifest ${path}/${filename}`, (t) => {
      const root = fixture(t)
      mkdirSync(resolve(root, path), { recursive: true })
      writeFileSync(resolve(root, path, filename), '{}\n')
      rejected(root, { calls: 0, pattern: /alternate workspace manifest/u })
    })
  }
}

for (const path of ['package.json', 'docs/package.json', 'utils/package.json', 'packages/react/package.json', 'tooling/eslint-solid/package.json', policyPath, 'pnpm-workspace.yaml']) {
  test(`reject symlinked file ${path}`, (t) => {
    const root = fixture(t)
    const actual = join(root, `${path}.original`)
    renameSync(join(root, path), actual)
    symlinkSync(actual, join(root, path))
    rejected(root, { calls: 0, pattern: /symlink/u })
  })
}

for (const path of ['docs', 'utils', 'packages', 'packages/vue', 'tooling', 'tooling/eslint-solid', 'scripts']) {
  test(`reject symlinked directory ${path}`, (t) => {
    const root = fixture(t)
    const actual = join(root, `${path}.original`)
    renameSync(join(root, path), actual)
    symlinkSync(actual, join(root, path), 'dir')
    rejected(root, { calls: 0, pattern: /symlink/u })
  })
}

test('reject dangling workspace symlinks', (t) => {
  const root = fixture(t)
  symlinkSync(join(root, 'missing'), join(root, 'packages/extra'))
  rejected(root, { calls: 0, pattern: /symlink/u })
})

test('reject a symlinked root even when all manifests are valid', (t) => {
  const root = fixture(t)
  const link = `${root}-link`
  symlinkSync(root, link, 'dir')
  t.after(() => rmSync(link))
  const runner = stub(root)
  assert.throws(() => runPublish({ root: link, argv: ['--publish'], runCommand: runner.command }), /root must be canonical/u)
  assert.equal(runner.calls.length, 0)
})

for (const path of [policyPath, 'package.json', 'docs/package.json', 'pnpm-workspace.yaml']) {
  test(`reject non-file ${path}`, (t) => {
    const root = fixture(t)
    const runner = stub(root)
    rmSync(join(root, path))
    mkdirSync(join(root, path))
    assert.throws(() => runPublish({ root, argv: ['--publish'], runCommand: runner.command }), /regular file/u)
    assert.equal(runner.calls.length, 0)
    assert.equal(runner.publishes(), 0)
  })
}

const commandFailures = [
  ['nonzero exit', response => ({ ...response, status: 1 })],
  ['missing exit status', response => ({ ...response, status: undefined })],
  ['null exit status', response => ({ ...response, status: null })],
  ['string exit status', response => ({ ...response, status: '0' })],
  ['signal', response => ({ ...response, signal: 'SIGTERM' })],
  ['spawn error', response => ({ ...response, error: new Error('unavailable') })],
  ['missing output', response => ({ ...response, stdout: undefined })],
  ['invalid JSON', response => ({ ...response, stdout: '{' })],
  ['banner before JSON', response => ({ ...response, stdout: `unexpected\n${response.stdout}` })],
  ['null JSON', response => ({ ...response, stdout: 'null' })],
  ['object JSON', response => ({ ...response, stdout: '{}' })],
  ['empty array', response => ({ ...response, stdout: '[]' })],
]
const selectionMutations = [
  ['missing package', entries => entries.pop()],
  ['extra package', entries => entries.push(entries[0])],
  ['duplicate entry', entries => entries[1] = entries[0]],
  ['null entry', entries => entries[0] = null],
  ['missing name', entries => delete entries[0].name],
  ['unknown name', entries => entries[0].name = '@destyler-ui/other'],
  ['missing path', entries => delete entries[0].path],
  ['relative path', entries => entries[0].path = 'packages/react'],
  ['outside path', entries => entries[0].path = '/tmp/outside'],
  ['noncanonical path', entries => entries[0].path += '/.'],
  ['swapped path', entries => entries[0].path = entries[1].path],
  ['missing version', entries => delete entries[0].version],
  ['wrong version', entries => entries[0].version = '1.2.3'],
  ['string privacy', entries => entries[0].private = 'false'],
  ['wrong privacy', entries => entries[0].private = true],
]
for (const stage of [1, 2]) {
  for (const [label, change] of commandFailures) {
    test(`reject discovery ${stage} ${label} without publishing`, (t) => {
      const root = fixture(t)
      rejected(root, { intercept: ({ call, response }) => call === stage ? change(response) : response, calls: stage })
    })
  }
  for (const [label, change] of selectionMutations) {
    test(`reject discovery ${stage} ${label} without publishing`, (t) => {
      const root = fixture(t)
      rejected(root, {
        intercept: ({ call, response }) => {
          if (call !== stage)
            return response
          const entries = JSON.parse(response.stdout)
          change(entries)
          return { ...response, stdout: JSON.stringify(entries) }
        },
        calls: stage,
      })
    })
  }
  test(`propagate thrown discovery ${stage} error without publishing`, (t) => {
    const root = fixture(t)
    rejected(root, {
      intercept: ({ call, response }) => {
        if (call === stage)
          throw new Error('stub discovery error')
        return response
      },
      calls: stage,
      pattern: /stub discovery error/u,
    })
  })
}

test('reject discovery missing private protection for a nonpublic workspace', (t) => {
  const root = fixture(t)
  rejected(root, {
    intercept: ({ response }) => {
      const entries = JSON.parse(response.stdout)
      delete entries.find(entry => entry.name === '@destyler-ui/docs').private
      return { ...response, stdout: JSON.stringify(entries) }
    },
    calls: 1,
    pattern: /privacy mismatch/u,
  })
})

function corruptReplacementCharacter(bytes) {
  const position = bytes.indexOf(Buffer.from('�'))
  assert.ok(position >= 0)
  return Buffer.concat([bytes.subarray(0, position), Buffer.from([0x80]), bytes.subarray(position + 3)])
}

for (const path of [policyPath, 'pnpm-workspace.yaml', 'packages/react/package.json']) {
  test(`reject invalid UTF-8 in ${path} before any command`, (t) => {
    const root = fixture(t)
    const runner = stub(root)
    const target = join(root, path)
    writeFileSync(target, Buffer.concat([readFileSync(target), Buffer.from([0x80])]))
    assert.throws(() => runPublish({ root, argv: ['--publish'], runCommand: runner.command }), /invalid UTF-8/u)
    assert.equal(runner.calls.length, 0)
    assert.equal(runner.publishes(), 0)
  })
}

for (const stage of [1, 2]) {
  test(`reread after discovery ${stage} catches changed bytes with identical lossy UTF-8 text`, (t) => {
    const root = fixture(t)
    editManifest(root, 'packages/react', 'description', '�')
    const target = join(root, 'packages/react/package.json')
    const before = readFileSync(target)
    const after = corruptReplacementCharacter(before)
    assert.notDeepEqual(after, before)
    assert.equal(after.toString('utf8'), before.toString('utf8'))
    rejected(root, {
      intercept: ({ call, response }) => {
        if (call === stage)
          writeFileSync(target, after)
        return response
      },
      calls: stage,
      pattern: /invalid UTF-8/u,
    })
  })
  test(`reject malformed UTF-8 bytes from discovery ${stage}`, (t) => {
    const root = fixture(t)
    rejected(root, {
      intercept: ({ call, response }) => {
        if (call !== stage)
          return response
        const entries = JSON.parse(response.stdout)
        entries[0].description = '�'
        return { ...response, stdout: corruptReplacementCharacter(Buffer.from(JSON.stringify(entries))) }
      },
      calls: stage,
      pattern: /invalid UTF-8/u,
    })
  })
}

for (const stage of [1, 2]) {
  test(`reread after discovery ${stage} does not silently strip a newly added BOM`, (t) => {
    const root = fixture(t)
    const target = join(root, 'packages/react/package.json')
    rejected(root, {
      intercept: ({ call, response }) => {
        if (call === stage)
          writeFileSync(target, Buffer.concat([Buffer.from([0xEF, 0xBB, 0xBF]), readFileSync(target)]))
        return response
      },
      calls: stage,
      pattern: /invalid JSON/u,
    })
  })
}

const discoveryMutations = [
  ['private manifest regression', root => editManifest(root, 'docs', 'private', 'true')],
  ['public identity replacement', root => editManifest(root, 'packages/react', 'name', '@destyler-ui/other')],
  ['manifest content change', root => editManifest(root, 'packages/react', 'description', 'changed')],
  ['valid version change', (root) => {
    for (const [path] of [['.'], ...publicPairs])
      editManifest(root, path, 'version', '1.2.3')
  }],
  ['policy scope replacement', root => editJson(root, policyPath, policy => policy.publicPackages.pop())],
  ['policy bytes change', root => writeFileSync(join(root, policyPath), `${readFileSync(join(root, policyPath), 'utf8')}\n`)],
  ['workspace patterns change', root => writeFileSync(join(root, 'pnpm-workspace.yaml'), 'packages: []\n')],
  ['workspace bytes change', root => writeFileSync(join(root, 'pnpm-workspace.yaml'), `${readFileSync(join(root, 'pnpm-workspace.yaml'), 'utf8')}# changed\n`)],
  ['new workspace', root => writeJson(root, 'packages/extra/package.json', { name: '@destyler-ui/extra', private: true })],
  ['alternate manifest', root => writeFileSync(join(root, 'packages/react/package.yaml'), 'name: override\n')],
  ['missing manifest', root => rmSync(join(root, 'packages/react/package.json'))],
  ['symlinked policy', (root) => {
    renameSync(join(root, policyPath), join(root, `${policyPath}.original`))
    symlinkSync(join(root, `${policyPath}.original`), join(root, policyPath))
  }],
  ['symlinked workspace', (root) => {
    renameSync(join(root, 'packages/react'), join(root, 'packages/react-original'))
    symlinkSync(join(root, 'packages/react-original'), join(root, 'packages/react'), 'dir')
  }],
]
for (const stage of [1, 2]) {
  for (const [label, mutate] of discoveryMutations) {
    test(`reread after discovery ${stage} rejects ${label} with zero publish calls`, (t) => {
      const root = fixture(t)
      rejected(root, {
        intercept: ({ call, response }) => {
          if (call === stage)
            mutate(root)
          return response
        },
        calls: stage,
      })
    })
  }
}

test('an authorized mocked publish execution failure is not reported as success', (t) => {
  const root = fixture(t)
  const runner = stub(root, ({ args, response }) => args.includes('publish') ? { ...response, status: 1 } : response)
  assert.throws(() => runPublish({ root, argv: ['--publish'], runCommand: runner.command }), /pnpm publish failed/u)
  assert.equal(runner.publishes(), 1, 'this is a stubbed executor failure after validation, not a validation rejection')
})

test('CLI default/check and import are offline even with no package manager on PATH', (t) => {
  const root = fixture(t)
  const env = { ...process.env, PATH: join(root, 'no-executables') }
  for (const args of [[], ['--check']]) {
    const result = spawnSync(process.execPath, [join(root, 'scripts/publish-packages.mjs'), ...args], { cwd: root, encoding: 'utf8', env })
    assert.equal(result.status, 0, result.stderr)
    assert.match(result.stdout, /offline/u)
  }
  const imported = spawnSync(process.execPath, ['--input-type=module', '-e', 'await import("./scripts/publish-packages.mjs")'], { cwd: root, encoding: 'utf8', env })
  assert.equal(imported.status, 0, imported.stderr)
  assert.equal(imported.stdout, '')
  const rejected = spawnSync(process.execPath, [join(root, 'scripts/publish-packages.mjs'), '--publish', '--dry-run'], { cwd: root, encoding: 'utf8', env })
  assert.equal(rejected.status, 1)
  assert.match(rejected.stderr, /no other arguments/u)
  assert.doesNotMatch(rejected.stderr, /ENOENT/u)
})

function cliStub(root, scenario) {
  const bin = join(root, 'stub-bin')
  mkdirSync(bin)
  writeJson(root, 'stub-inventory.json', records(root, allPairs))
  writeJson(root, 'stub-targets.json', records(root, publicPairs))
  const executable = join(bin, 'pnpm')
  // This executable only records argv and returns fixture data. In particular,
  // its publish branch cannot execute pnpm, npm, network, hooks, or packing.
  writeFileSync(executable, `#!${process.execPath}
const fs = require('node:fs')
const path = require('node:path')
const args = process.argv.slice(2)
const root = process.cwd()
const scenario = process.env.PUBLISH_GUARD_TEST_SCENARIO
fs.appendFileSync(path.join(root, 'stub-calls.jsonl'), JSON.stringify(args) + '\\n')
if (args.includes('publish')) {
  process.exit(scenario === 'publish-failure' ? 7 : 0)
}
const selected = args.includes('--filter')
const output = fs.readFileSync(path.join(root, selected ? 'stub-targets.json' : 'stub-inventory.json'), 'utf8')
if (scenario === 'nonzero' || (selected && scenario === 'selected-nonzero'))
  process.exit(3)
if (selected && scenario === 'signal')
  process.kill(process.pid, 'SIGTERM')
if (selected && scenario === 'overflow') {
  process.stdout.write('x'.repeat(5 * 1024 * 1024))
}
else if (selected && scenario === 'invalid-utf8') {
  const entries = JSON.parse(output)
  entries[0].description = String.fromCodePoint(0xFFFD)
  const bytes = Buffer.from(JSON.stringify(entries))
  const position = bytes.indexOf(Buffer.from(String.fromCodePoint(0xFFFD)))
  process.stdout.write(Buffer.concat([bytes.subarray(0, position), Buffer.from([0x80]), bytes.subarray(position + 3)]))
}
else if (selected && scenario === 'malformed') {
  process.stdout.write('{')
}
else {
  if ((selected && scenario === 'mutate-second') || (!selected && scenario === 'mutate-first')) {
    const manifestPath = path.join(root, 'docs/package.json')
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
    manifest.private = 'true'
    fs.writeFileSync(manifestPath, JSON.stringify(manifest))
  }
  process.stdout.write(output)
}
`)
  chmodSync(executable, 0o755)
  const result = spawnSync(process.execPath, [join(root, 'scripts/publish-packages.mjs'), '--publish'], {
    cwd: root,
    encoding: 'utf8',
    env: { ...process.env, PATH: `${bin}${delimiter}${join(root, 'no-real-executables')}`, PUBLISH_GUARD_TEST_SCENARIO: scenario },
    timeout: 15000,
  })
  const calls = readFileSync(join(root, 'stub-calls.jsonl'), 'utf8').trim().split('\n').map(line => JSON.parse(line))
  return { result, calls, publishes: calls.filter(args => args.includes('publish')).length }
}

test('real CLI subprocess dispatches only exact arguments to a nonpublishing pnpm fixture', (t) => {
  const { result, calls, publishes } = cliStub(fixture(t), 'success')
  assert.equal(result.error, undefined)
  assert.equal(result.status, 0, result.stderr)
  assert.deepEqual(calls, [listArgs, selectedArgs, publishArgs])
  assert.equal(publishes, 1, 'this is only a recording fixture, not a publish process')
})

for (const scenario of ['nonzero', 'selected-nonzero', 'signal', 'overflow', 'malformed', 'invalid-utf8', 'mutate-first', 'mutate-second']) {
  test(`real CLI ${scenario} rejection makes zero fixture publish calls`, (t) => {
    const { result, calls, publishes } = cliStub(fixture(t), scenario)
    assert.equal(result.error, undefined)
    assert.equal(result.status, 1, result.stderr)
    assert.equal(publishes, 0)
    assert.equal(calls.length, ['nonzero', 'mutate-first'].includes(scenario) ? 1 : 2)
    assert.match(result.stderr, /Publish scope:/u)
  })
}

test('real CLI propagates a nonexecuting publish fixture failure', (t) => {
  const { result, calls, publishes } = cliStub(fixture(t), 'publish-failure')
  assert.equal(result.error, undefined)
  assert.equal(result.status, 1)
  assert.match(result.stderr, /pnpm publish failed/u)
  assert.deepEqual(calls, [listArgs, selectedArgs, publishArgs])
  assert.equal(publishes, 1)
})

test('real CLI fails closed when pnpm is unavailable', (t) => {
  const root = fixture(t)
  const result = spawnSync(process.execPath, [join(root, 'scripts/publish-packages.mjs'), '--publish'], {
    cwd: root,
    encoding: 'utf8',
    env: { ...process.env, PATH: join(root, 'no-executables') },
  })
  assert.equal(result.status, 1)
  assert.match(result.stderr, /pnpm workspace discovery failed/u)
})

test('root scripts preserve release/tag behavior and require explicit publishing', () => {
  const root = JSON.parse(readFileSync(join(repositoryRoot, 'package.json'), 'utf8'))
  assert.equal(root.scripts.release, 'bumpp package.json packages/**/package.json --commit --push --tag')
  assert.equal(root.scripts['publish:ci'], 'node scripts/publish-packages.mjs --publish')
  assert.equal(root.scripts['check:publish'], 'node scripts/publish-packages.mjs --check')
  assert.equal(root.scripts['test:publish'], 'node --test scripts/test-publish.mjs')
  for (const framework of ['react', 'vue']) {
    const manifest = JSON.parse(readFileSync(join(repositoryRoot, `packages/${framework}/package.json`), 'utf8'))
    assert.equal(manifest.scripts.prepublishOnly, 'pnpm run build')
  }
  for (const framework of ['solid', 'svelte']) {
    const manifest = JSON.parse(readFileSync(join(repositoryRoot, `packages/${framework}/package.json`), 'utf8'))
    assert.equal(manifest.scripts.prepack, 'pnpm run check')
  }
})

test('CI and release validate offline before pnpm setup/install, preserving existing release gates', () => {
  for (const workflow of ['ci', 'release']) {
    const source = readFileSync(join(repositoryRoot, `.github/workflows/${workflow}.yml`), 'utf8')
    const tests = source.indexOf('node --test scripts/test-publish.mjs')
    const check = source.indexOf('node scripts/publish-packages.mjs --check')
    const pnpmSetup = source.indexOf('uses: pnpm/action-setup@')
    assert.ok(source.indexOf('uses: actions/setup-node@') < tests)
    assert.ok(tests > 0 && tests < check && check < pnpmSetup && pnpmSetup < source.indexOf('pnpm install --frozen-lockfile'))
  }
  const release = readFileSync(join(repositoryRoot, '.github/workflows/release.yml'), 'utf8')
  const gates = [
    'pnpm run lint',
    'pnpm run test:ci',
    'pnpm run test:browser-smoke',
    'pnpm --filter @destyler-ui/react check',
    'PACKED_BROWSER=1 pnpm --filter @destyler-ui/react check:package',
    'pnpm --filter @destyler-ui/vue check',
    'PACKED_BROWSER=1 pnpm exec node scripts/test-vue-package.mjs',
    'pnpm --filter @destyler-ui/svelte check:ci',
    'PACKED_BROWSER=1 pnpm exec node scripts/test-svelte-package.mjs',
    'pnpm --filter @destyler-ui/solid check',
    'PACKED_BROWSER=1 pnpm exec node scripts/test-solid-package.mjs',
    ...['react', 'vue', 'svelte', 'solid'].map(framework => `pnpm --filter @destyler-ui/${framework} build-storybook`),
    'pnpm run docs:build',
    'npx changelogithub',
    'npm i -g npm@latest',
    'pnpm run publish:ci',
  ]
  let previous = -1
  for (const gate of gates) {
    const position = release.indexOf(gate)
    assert.ok(position > previous, `missing or reordered release gate: ${gate}`)
    previous = position
  }
})
