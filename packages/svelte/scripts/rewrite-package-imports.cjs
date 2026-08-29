const fs = require('node:fs')
const path = require('node:path')
const process = require('node:process')

const packageRoot = path.resolve(__dirname, '..')
const distRoot = path.join(packageRoot, 'dist')
const checkOnly = process.argv.includes('--check')
const moduleSpecifierPattern = /(\bfrom\s+|\bimport\s*\(\s*|\bimport\s+)(['"])(\.{1,2}\/[^'"\n]+)\2/g

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(directory, entry.name)
    return entry.isDirectory() ? walk(file) : [file]
  })
}

function resolveSpecifier(file, specifier) {
  const target = path.resolve(path.dirname(file), specifier)
  if (specifier.endsWith('.svelte') && fs.existsSync(`${target}.js`))
    return `${specifier}.js`
  if (path.posix.extname(specifier) !== '')
    return specifier
  if (fs.existsSync(`${target}.js`) || fs.existsSync(`${target}.d.ts`))
    return `${specifier}.js`
  if (fs.existsSync(path.join(target, 'index.js')) || fs.existsSync(path.join(target, 'index.d.ts')))
    return `${specifier}/index.js`
  throw new Error(`Cannot resolve relative package import ${specifier} from ${path.relative(packageRoot, file)}`)
}

function getSvelteCompatibilityDeclaration(file) {
  if (!file.endsWith('.svelte.d.ts'))
    return null
  const component = file.slice(0, -'.d.ts'.length)
  if (!fs.existsSync(component))
    return null
  return `${file.slice(0, -'.svelte.d.ts'.length)}.d.svelte.ts`
}

if (!fs.existsSync(distRoot))
  throw new Error('Missing dist directory. Run pnpm build before checking package imports.')

const files = walk(distRoot).filter(file => file.endsWith('.js') || file.endsWith('.d.ts'))
const invalid = []
let rewrittenFiles = 0
let rewrittenSpecifiers = 0
let compatibilityDeclarations = 0

for (const file of files) {
  const source = fs.readFileSync(file, 'utf8')
  const output = source.replace(moduleSpecifierPattern, (match, prefix, quote, specifier) => {
    const replacement = resolveSpecifier(file, specifier)
    if (replacement === specifier)
      return match
    if (checkOnly) {
      invalid.push(`${path.relative(packageRoot, file)}: ${specifier} -> ${replacement}`)
      return match
    }
    rewrittenSpecifiers += 1
    return `${prefix}${quote}${replacement}${quote}`
  })
  if (output !== source) {
    rewrittenFiles += 1
    fs.writeFileSync(file, output)
  }

  const compatibilityDeclaration = getSvelteCompatibilityDeclaration(file)
  if (compatibilityDeclaration) {
    compatibilityDeclarations += 1
    if (checkOnly) {
      if (!fs.existsSync(compatibilityDeclaration)) {
        invalid.push(`${path.relative(packageRoot, compatibilityDeclaration)}: missing NodeNext Svelte declaration`)
      }
      else if (fs.readFileSync(compatibilityDeclaration, 'utf8') !== output) {
        invalid.push(`${path.relative(packageRoot, compatibilityDeclaration)}: stale NodeNext Svelte declaration`)
      }
    }
    else {
      fs.writeFileSync(compatibilityDeclaration, output)
    }
  }
}

if (invalid.length > 0) {
  throw new Error(
    `Package contains invalid relative imports or Svelte declarations:\n${invalid.map(entry => `  - ${entry}`).join('\n')}`,
  )
}

process.stdout.write(
  checkOnly
    ? `Package imports checked: ${files.length} JavaScript/declaration files and ${compatibilityDeclarations} NodeNext Svelte declarations\n`
    : `Package imports rewritten: ${rewrittenSpecifiers} specifiers in ${rewrittenFiles} files; generated ${compatibilityDeclarations} NodeNext Svelte declarations\n`,
)
