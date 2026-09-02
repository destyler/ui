const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const fs = require('node:fs')
const path = require('node:path')
const process = require('node:process')

const packageRoot = path.resolve(__dirname, '..')
const packageJson = require(path.join(packageRoot, 'package.json'))
const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm'

function entryDirectories(section) {
  const root = path.join(packageRoot, 'src', section)
  return fs.readdirSync(root, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .filter(entry => ['index.ts', 'index.tsx'].some(file => fs.existsSync(path.join(root, entry.name, file))))
    .map(entry => entry.name)
    .sort()
}

function expandTarget(target, slug) {
  return target.replace('*', slug).replace(/^\.\//, '')
}

const result = spawnSync(
  npmCommand,
  ['pack', '--dry-run', '--ignore-scripts', '--json'],
  { cwd: packageRoot, encoding: 'utf8' },
)

if (result.status !== 0)
  throw new Error(result.stderr || result.stdout || 'npm pack --dry-run failed')

const pack = JSON.parse(result.stdout)[0]
const packedFiles = new Set(pack.files.map(file => file.path))
const components = entryDirectories('components')
const providers = entryDirectories('providers')

assert.equal(components.length, 46, 'The published package must contain 46 component entries')
assert.equal(providers.length, 7, 'The published package must contain 7 provider entries')

const excluded = [...packedFiles].filter(file => (
  file.startsWith('src/')
  || file.startsWith('scripts/')
  || file.startsWith('tests/')
  || file.startsWith('.storybook/')
  || file.startsWith('tsconfig')
  || /\/(?:examples|stories|tests?)\//.test(file)
  || /\.(?:stories|test)\.[^.]+$/.test(file)
))
assert.deepEqual(excluded, [], `Package contains development-only files:\n${excluded.join('\n')}`)

for (const required of ['LICENSE', 'README.md', 'package.json'])
  assert(packedFiles.has(required), `Package is missing ${required}`)

const entries = [
  ['.', packageJson.exports['.'], undefined],
  ...['anatomy', 'collection', 'factory'].map(name => [`./${name}`, packageJson.exports[`./${name}`], undefined]),
  ...providers.map(slug => [`./${slug}`, packageJson.exports[`./${slug}`], undefined]),
  ...components.map(slug => [`./${slug}`, packageJson.exports['./*'], slug]),
]

assert.equal(entries.length, 57, 'The package must expose 57 runtime entry points')
const failures = []
for (const [subpath, conditions, slug] of entries) {
  if (!conditions || typeof conditions !== 'object') {
    failures.push(`${subpath}: missing export map`)
    continue
  }

  for (const [condition, extension] of [
    ['types', '.d.ts'],
    ['solid', '.jsx'],
    ['import', '.js'],
    ['default', '.js'],
  ]) {
    const target = conditions[condition]
    if (typeof target !== 'string') {
      failures.push(`${subpath}: missing ${condition} target`)
      continue
    }
    const file = expandTarget(target, slug)
    if (!file.endsWith(extension))
      failures.push(`${subpath}: ${condition} target must end in ${extension}`)
    if (!packedFiles.has(file))
      failures.push(`${subpath}: packed package is missing ${file}`)
  }

  if (conditions.default !== conditions.import)
    failures.push(`${subpath}: default and import targets differ`)
  if (conditions.source) {
    const source = expandTarget(conditions.source, slug)
    if (!packedFiles.has(source))
      failures.push(`${subpath}: packed package is missing source target ${source}`)
  }
}

assert(packedFiles.has('package.json'), 'The package.json export target is missing')
if (failures.length > 0)
  throw new Error(`Invalid package entries:\n${failures.map(failure => `  - ${failure}`).join('\n')}`)

process.stdout.write(
  `Package contents checked: ${pack.entryCount} files, ${entries.length} runtime entries, ${pack.unpackedSize} bytes\n`,
)
