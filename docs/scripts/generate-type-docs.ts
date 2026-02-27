/**
 * generate-type-docs.ts
 *
 * Extracts Props and Emits type information from the compiled dist of each
 * framework package and writes JSON files consumed by the Astro docs site.
 *
 * Usage:
 *   npx tsx docs/scripts/generate-type-docs.ts vue
 *   npx tsx docs/scripts/generate-type-docs.ts react
 *
 * Prerequisites:
 *   The target framework package must be built first (`pnpm vue build` / `pnpm react build`)
 *   so that `dist/index.d.ts` (or `dist/index.d.mts`) exists.
 *
 * Output:
 *   docs/src/data/types/<framework>/<component>.types.json
 */

import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '../..')

function kebabToPascal(str: string): string {
  return str
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join('')
}

// ---------------------------------------------------------------------------
// Property extraction
// ---------------------------------------------------------------------------

interface PropInfo {
  type: string
  isRequired: boolean
  defaultValue?: string
  description?: string
}

type PropsMap = Record<string, PropInfo>

function getSourceFileName(symbol: ts.Symbol): string | undefined {
  const declarations = symbol.getDeclarations()
  if (!declarations || declarations.length === 0)
    return undefined
  return declarations[0].getSourceFile().fileName
}

function shouldIgnoreProperty(property: ts.Symbol): boolean {
  const sourceFileName = getSourceFileName(property)
  // Skip properties originating from external packages (react, vue, etc.)
  // but keep properties from @destyler/*
  const isExternal
    = sourceFileName?.includes('node_modules')
      && !sourceFileName?.includes('@destyler')
  const isExcludedByName = ['children', 'ref', 'key'].includes(property.getName())
  return !!(isExternal || isExcludedByName)
}

function extractProperties(
  typeNode: ts.Node,
  checker: ts.TypeChecker,
): PropsMap {
  const properties: PropsMap = {}
  const type = checker.getTypeAtLocation(typeNode)

  for (const property of type.getProperties()) {
    if (shouldIgnoreProperty(property))
      continue

    const propertyName = property.getName()
    // Skip internal/framework properties
    if (propertyName.startsWith('$') || propertyName.startsWith('_'))
      continue

    const propType = checker.getTypeOfSymbolAtLocation(property, typeNode)
    const nonNullableType = propType.getNonNullableType()
    const typeName = checker.typeToString(nonNullableType)
    const isRequired = nonNullableType === propType && typeName !== 'any'

    const defaultTag = property
      .getJsDocTags()
      .find(tag => tag.name === 'default')
    const defaultValue = defaultTag?.text?.[0]?.text

    const description = property
      .getDocumentationComment(checker)
      .map(c => c.text)
      .join('\n') || undefined

    properties[propertyName] = {
      type: typeName,
      isRequired,
      ...(defaultValue !== undefined ? { defaultValue } : {}),
      ...(description !== undefined ? { description } : {}),
    }
  }

  // Sort: required first, then alphabetical
  return Object.fromEntries(
    Object.entries(properties)
      .sort(([a], [b]) => a.localeCompare(b))
      .sort(([, a], [, b]) => (a.isRequired === b.isRequired ? 0 : a.isRequired ? -1 : 1)),
  )
}

// ---------------------------------------------------------------------------
// Main extraction logic
// ---------------------------------------------------------------------------

interface DataAttrInfo {
  name: string
  type: string
}

interface PartTypes {
  props?: PropsMap
  emits?: PropsMap
  dataAttr?: DataAttrInfo[]
}

type ComponentTypesMap = Record<string, PartTypes>

function extractComponentTypes(
  sourceFile: ts.SourceFile,
  checker: ts.TypeChecker,
  prefix: string,
): ComponentTypesMap {
  const result: ComponentTypesMap = {}
  // Match: <Prefix><PartName>(Props|Emits)
  // e.g. AvatarRootProps, CollapseItemContentProps, DialogRootEmits
  const regex = new RegExp(`^${prefix}(\\w+?)(Props|Emits)$`)

  for (const statement of sourceFile.statements) {
    if (!ts.isInterfaceDeclaration(statement) && !ts.isTypeAliasDeclaration(statement))
      continue

    const name = statement.name.getText()
    const match = name.match(regex)
    if (!match)
      continue

    const [, partName, kind] = match

    // Skip internal types
    if (partName.endsWith('Context'))
      continue // Context providers (slots API)
    if (partName.endsWith('Base'))
      continue // React intermediate types
    if (partName === 'RootProvider')
      continue // Advanced provider API

    const props = extractProperties(statement, checker)
    if (Object.keys(props).length === 0)
      continue

    const part = partName || 'Root'
    if (!result[part])
      result[part] = {}

    if (kind === 'Props') {
      result[part].props = props
    }
    else if (kind === 'Emits') {
      result[part].emits = props
    }
  }

  return result
}

// ---------------------------------------------------------------------------
// Data attribute extraction from upstream machine packages
// ---------------------------------------------------------------------------

/**
 * Reads the anatomy.ts file for a component to find the upstream @destyler/* package.
 * e.g. avatar -> @destyler/image, collapse -> @destyler/collapse
 */
function resolveUpstreamPackage(componentDir: string): string | null {
  const anatomyPath = path.join(componentDir, 'anatomy.ts')
  if (!fs.existsSync(anatomyPath))
    return null
  const content = fs.readFileSync(anatomyPath, 'utf-8')
  const match = content.match(/'@destyler\/([^']+)'/) || content.match(/"@destyler\/([^"]+)"/)
  return match ? match[1] : null
}

/**
 * Parses the compiled machine JS (dist/index.mjs) to extract data-* attributes
 * for each part from the get{Part}Props methods.
 */
function extractDataAttributes(
  pkgDir: string,
  upstreamPkg: string,
): Record<string, DataAttrInfo[]> {
  const mjsPath = path.join(pkgDir, 'node_modules', '@destyler', upstreamPkg, 'dist', 'index.mjs')
  if (!fs.existsSync(mjsPath))
    return {}

  const code = fs.readFileSync(mjsPath, 'utf-8')

  // Find all get{Part}Props methods
  const methodRegex = /get(\w+)Props\b[^{]*\{/g
  let m: RegExpExecArray | null = methodRegex.exec(code)
  const positions: { name: string, start: number }[] = []
  while (m !== null) {
    positions.push({ name: m[1], start: m.index })
    m = methodRegex.exec(code)
  }

  const result: Record<string, DataAttrInfo[]> = {}

  for (const pos of positions) {
    // Find the balanced closing brace to extract the method body
    let braceCount = 0
    let inMethod = false
    let end = pos.start
    for (let j = pos.start; j < code.length; j++) {
      if (code[j] === '{') { braceCount++; inMethod = true }
      if (code[j] === '}') { braceCount-- }
      if (inMethod && braceCount === 0) { end = j; break }
    }
    const body = code.substring(pos.start, end + 1)

    const attrs: DataAttrInfo[] = []

    // Check for ...parts.xxx.attrs spread (provides data-scope and data-part)
    const partsMatch = body.match(/\.\.\.\s*parts\.(\w+)\.attrs/)
    if (partsMatch) {
      const partKey = partsMatch[1]
      const partName = partKey.replace(/([A-Z])/g, '-$1').toLowerCase()
      attrs.push(
        { name: 'data-scope', type: `"${upstreamPkg}"` },
        { name: 'data-part', type: `"${partName}"` },
      )
    }

    // Extract explicit data-* attributes
    const dataAttrRegex = /"(data-[a-z-]+)":\s*([^\n,}]+)/g
    let attrMatch: RegExpExecArray | null = dataAttrRegex.exec(body)
    while (attrMatch !== null) {
      const attrName = attrMatch[1]
      if (attrName === 'data-scope' || attrName === 'data-part') {
        attrMatch = dataAttrRegex.exec(body)
        continue
      }

      let value = attrMatch[2].trim()
      value = normalizeDataAttrValue(value)

      attrs.push({ name: attrName, type: value })
      attrMatch = dataAttrRegex.exec(body)
    }

    if (attrs.length > 0) {
      result[pos.name] = attrs
    }
  }

  return result
}

/**
 * Convert raw JS expressions into human-readable type descriptions.
 */
function normalizeDataAttrValue(raw: string): string {
  // dataAttr(...) → boolean presence attribute
  if (raw.startsWith('dataAttr('))
    return '"" | undefined'

  // Ternary with string literals: x ? "a" : "b"
  if (raw.includes('?')) {
    const strings = [...raw.matchAll(/"([^"]+)"/g)].map(s => s[1])
    if (strings.length > 0) {
      return strings.map(s => `"${s}"`).join(' | ')
    }
  }

  // state.context.orientation → known enum
  if (raw.includes('orientation'))
    return '"horizontal" | "vertical"'
  if (raw.includes('placement'))
    return 'Placement'
  if (raw.includes('dir'))
    return '"ltr" | "rtl"'

  // Fallback: show as string
  return 'string'
}

/**
 * Map from anatomy part key (camelCase like "itemTrigger") to
 * component part name (PascalCase like "ItemTrigger").
 */
function anatomyKeyToPartName(key: string): string {
  return key.charAt(0).toUpperCase() + key.slice(1)
}

function getDistFilePath(framework: string): string {
  const pkgDir = path.join(rootDir, 'packages', framework)
  // Vue uses index.d.ts, React uses index.d.mts
  const candidates = ['dist/index.d.ts', 'dist/index.d.mts']
  for (const candidate of candidates) {
    const fullPath = path.join(pkgDir, candidate)
    if (fs.existsSync(fullPath))
      return fullPath
  }
  throw new Error(
    `No declaration file found for ${framework}. Did you run \`pnpm ${framework} build\` first?`,
  )
}

function getComponentDirs(framework: string): { name: string, dir: string }[] {
  const pkgDir = path.join(rootDir, 'packages', framework)
  const dirs: { name: string, dir: string }[] = []

  for (const subDir of ['src/components', 'src/providers']) {
    const fullDir = path.join(pkgDir, subDir)
    if (!fs.existsSync(fullDir))
      continue

    for (const entry of fs.readdirSync(fullDir, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        dirs.push({ name: entry.name, dir: path.join(fullDir, entry.name) })
      }
    }
  }

  return dirs
}

async function extractTypesForFramework(framework: string) {
  const distFile = getDistFilePath(framework)
  const pkgDir = path.join(rootDir, 'packages', framework)
  const outDir = path.join(rootDir, 'docs', 'src', 'data', 'types', framework)

  console.log(`Reading declarations from ${path.relative(rootDir, distFile)}`)

  // Create a TypeScript program to parse the dist declaration file
  const configPath = path.join(pkgDir, 'tsconfig.json')
  const configFile = ts.readConfigFile(configPath, ts.sys.readFile)
  const { options } = ts.parseJsonConfigFileContent(configFile.config, ts.sys, pkgDir)

  const program = ts.createProgram([distFile], {
    ...options,
    noEmit: true,
    declaration: false,
    emitDeclarationOnly: false,
  })

  const sourceFile = program.getSourceFile(distFile)
  if (!sourceFile) {
    throw new Error(`Could not parse ${distFile}`)
  }

  const checker = program.getTypeChecker()
  const componentDirs = getComponentDirs(framework)

  let count = 0
  fs.mkdirSync(outDir, { recursive: true })

  for (const comp of componentDirs) {
    const prefix = kebabToPascal(comp.name)
    const types = extractComponentTypes(sourceFile, checker, prefix)

    if (Object.keys(types).length === 0)
      continue

    // Extract data attributes from upstream machine package
    const upstreamPkg = resolveUpstreamPackage(comp.dir)
    if (upstreamPkg) {
      const dataAttrs = extractDataAttributes(pkgDir, upstreamPkg)
      for (const [anatomyKey, attrs] of Object.entries(dataAttrs)) {
        const partName = anatomyKeyToPartName(anatomyKey)
        if (types[partName]) {
          types[partName].dataAttr = attrs
        }
      }
    }

    const outPath = path.join(outDir, `${comp.name}.types.json`)
    fs.writeFileSync(outPath, `${JSON.stringify(types, null, 2)}\n`)
    count++
    console.log(`  ✓ ${comp.name} (${Object.keys(types).length} parts)`)
  }

  console.log(`\nGenerated ${count} type files → ${path.relative(rootDir, outDir)}/`)
}

// ---------------------------------------------------------------------------
// CLI entry
// ---------------------------------------------------------------------------

async function main() {
  const framework = process.argv[2]
  if (!framework) {
    console.error('Usage: npx tsx docs/scripts/generate-type-docs.ts <framework>')
    console.error('  framework: vue | react')
    process.exit(1)
  }

  const pkgDir = path.join(rootDir, 'packages', framework)
  if (!fs.existsSync(pkgDir)) {
    console.error(`Package not found: packages/${framework}`)
    process.exit(1)
  }

  console.log(`Generating type docs for ${framework}...\n`)
  await extractTypesForFramework(framework)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
