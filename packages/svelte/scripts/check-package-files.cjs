const { spawnSync } = require('node:child_process')
const path = require('node:path')
const process = require('node:process')

const packageRoot = path.resolve(__dirname, '..')
const packageJson = require(path.join(packageRoot, 'package.json'))
const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm'
const result = spawnSync(
  npmCommand,
  ['pack', '--dry-run', '--ignore-scripts', '--json'],
  { cwd: packageRoot, encoding: 'utf8' },
)

if (result.status !== 0)
  throw new Error(result.stderr || result.stdout || 'npm pack --dry-run failed')

const pack = JSON.parse(result.stdout)[0]
const packedFiles = new Set(pack.files.map(file => file.path))
const excluded = [...packedFiles]
  .filter(file => (
    /\/(?:examples|stories|test)\//.test(file)
    || /\.(?:stories|test)\.[^.]+$/.test(file)
    || /\/(?:component-categories\.[^/]+|provider-categories\.[^/]+)$/.test(file)
  ))

if (excluded.length > 0)
  throw new Error(`Package contains development-only files:\n${excluded.map(file => `  - ${file}`).join('\n')}`)

const requiredPackageFiles = ['LICENSE', 'README.md', 'package.json']
const missingPackageFiles = requiredPackageFiles.filter(file => !packedFiles.has(file))

if (missingPackageFiles.length > 0)
  throw new Error(`Package is missing required files:\n${missingPackageFiles.map(file => `  - ${file}`).join('\n')}`)

const exportTargets = Object.values(packageJson.exports)
  .flatMap(conditions => Object.values(conditions))
  .map(target => target.replace(/^\.\//, ''))
const exportCount = Object.keys(packageJson.exports).length
const missingExportTargets = exportTargets.filter(target => !packedFiles.has(target))

if (missingExportTargets.length > 0)
  throw new Error(`Package is missing export targets:\n${missingExportTargets.map(file => `  - ${file}`).join('\n')}`)

process.stdout.write(
  `Package contents checked: ${pack.entryCount} files, ${exportCount} exports, ${pack.unpackedSize} bytes\n`,
)
