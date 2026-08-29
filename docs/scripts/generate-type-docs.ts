/**
 * generate-type-docs.ts
 *
 * Extracts Props and Emits type information from the compiled dist of each
 * framework package and writes JSON files consumed by the Astro docs site.
 *
 * Usage:
 *   npx tsx docs/scripts/generate-type-docs.ts          # all frameworks
 *   npx tsx docs/scripts/generate-type-docs.ts svelte   # one framework
 *
 * Prerequisites:
 *   The target framework package must be built first (`pnpm <framework> build`)
 *   so that `dist/index.d.ts` (or `dist/index.d.mts`) exists.
 *
 * Output:
 *   docs/src/data/types/<framework>/<component>.types.json
 */

import type { FrameworkDefinition } from '../src/config/frameworks'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'
import { frameworks, getFramework, isFramework } from '../src/config/frameworks'

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

function getPropertyTypeName(
  propertyType: ts.Type,
  typeNode: ts.Node,
  checker: ts.TypeChecker,
  isOptional: boolean,
): string {
  const typeName = checker.typeToString(propertyType)
  const includesUndefined = !!(propertyType.flags & ts.TypeFlags.Undefined)
    || (propertyType.isUnion() && propertyType.types.some(type => !!(type.flags & ts.TypeFlags.Undefined)))
  if (!isOptional || !includesUndefined)
    return typeName

  // `prop?: T` is represented as `T | undefined` by TypeScript. Hide only
  // that optional marker while retaining meaningful nullable unions such as
  // `T | null`. Required `T | undefined` properties remain unchanged.
  if (!propertyType.isUnion())
    return typeName

  const members = propertyType.types.filter(member => !(member.flags & ts.TypeFlags.Undefined))
  if (members.length === 0 || members.length === propertyType.types.length)
    return typeName

  const memberNodes = members.map(member => checker.typeToTypeNode(member, typeNode, undefined))
  if (memberNodes.some(member => !member))
    return typeName

  const displayType = memberNodes.length === 1
    ? memberNodes[0]!
    : ts.factory.createUnionTypeNode(memberNodes as ts.TypeNode[])
  return ts.createPrinter({ removeComments: true })
    .printNode(ts.EmitHint.Unspecified, displayType, typeNode.getSourceFile())
}

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
  // `children` can be the complete public API of render-prop components such
  // as Context and Actions. Inherited framework children are already removed
  // by the external-source check above.
  const isExcludedByName = ['ref', 'key'].includes(property.getName())
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
    const isOptional = !!(property.flags & ts.SymbolFlags.Optional)
    const typeName = getPropertyTypeName(propType, typeNode, checker, isOptional)
    const isRequired = !isOptional

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

function validatePropertyExtractionRegression(): void {
  const fileName = path.join(rootDir, '__type-docs-property-regression__.ts')
  const sourceText = [
    'interface RegressionProps {',
    '  requiredAny: any',
    '  requiredNullable: string | null | undefined',
    '  optionalNullable?: string | null',
    '}',
  ].join('\n')
  const options: ts.CompilerOptions = { noEmit: true, strict: true }
  const host = ts.createCompilerHost(options)
  const getSourceFile = host.getSourceFile.bind(host)

  host.fileExists = requestedFile => requestedFile === fileName || ts.sys.fileExists(requestedFile)
  host.readFile = requestedFile => requestedFile === fileName ? sourceText : ts.sys.readFile(requestedFile)
  host.getSourceFile = (requestedFile, languageVersion, onError, shouldCreateNewSourceFile) => {
    if (requestedFile === fileName) {
      return ts.createSourceFile(
        requestedFile,
        sourceText,
        languageVersion,
        true,
        ts.ScriptKind.TS,
      )
    }
    return getSourceFile(requestedFile, languageVersion, onError, shouldCreateNewSourceFile)
  }

  const program = ts.createProgram([fileName], options, host)
  const sourceFile = program.getSourceFile(fileName)
  const declaration = sourceFile?.statements.find(ts.isInterfaceDeclaration)
  if (!declaration)
    throw new Error('Could not create the type docs property regression fixture')

  const props = extractProperties(declaration, program.getTypeChecker())
  const passed = props.requiredAny?.isRequired === true
    && props.requiredAny.type === 'any'
    && props.requiredNullable?.isRequired === true
    && /\bnull\b/.test(props.requiredNullable.type)
    && /\bundefined\b/.test(props.requiredNullable.type)
    && props.optionalNullable?.isRequired === false
    && /\bnull\b/.test(props.optionalNullable.type)
    && !/\bundefined\b/.test(props.optionalNullable.type)

  if (!passed)
    throw new Error('Type docs property requiredness regression failed')
}

// ---------------------------------------------------------------------------
// Main extraction logic
// ---------------------------------------------------------------------------

interface PartTypes {
  props?: PropsMap
  emits?: PropsMap
}

type ComponentTypesMap = Record<string, PartTypes>

function mergeComponentTypes(target: ComponentTypesMap, source: ComponentTypesMap): void {
  for (const [partName, partTypes] of Object.entries(source)) {
    const current = target[partName] ?? {}
    target[partName] = {
      ...current,
      ...partTypes,
      ...(current.props || partTypes.props
        ? { props: { ...current.props, ...partTypes.props } }
        : {}),
      ...(current.emits || partTypes.emits
        ? { emits: { ...current.emits, ...partTypes.emits } }
        : {}),
    }
  }
}

function resolveAliasedSymbol(symbol: ts.Symbol, checker: ts.TypeChecker): ts.Symbol {
  return symbol.flags & ts.SymbolFlags.Alias
    ? checker.getAliasedSymbol(symbol)
    : symbol
}

function extractExportedProperties(symbol: ts.Symbol, checker: ts.TypeChecker): PropsMap {
  const resolved = resolveAliasedSymbol(symbol, checker)
  const declaration = resolved.valueDeclaration ?? resolved.getDeclarations()?.[0]
  return declaration ? extractProperties(declaration, checker) : {}
}

function getModuleExports(
  program: ts.Program,
  checker: ts.TypeChecker,
  filePath: string,
): Map<string, ts.Symbol> {
  const sourceFile = program.getSourceFile(filePath)
  if (!sourceFile)
    throw new Error(`Could not parse ${filePath}`)

  const moduleSymbol = checker.getSymbolAtLocation(sourceFile)
  if (!moduleSymbol)
    throw new Error(`Could not resolve exports for ${filePath}`)

  return new Map(checker.getExportsOfModule(moduleSymbol).map(symbol => [symbol.name, symbol]))
}

interface PublicComponentExport {
  partName: string
  valueName: string
  symbols: Map<string, ts.Symbol>
}

function isPublicComponentValue(
  exports: Map<string, ts.Symbol>,
  valueName: string,
  checker: ts.TypeChecker,
): boolean {
  const value = exports.get(valueName)
  return !!value
    && !!(resolveAliasedSymbol(value, checker).flags & ts.SymbolFlags.Value)
}

function getOwnedPartName(valueName: string, prefix: string): string {
  if (valueName === prefix)
    return 'Root'

  const suffix = valueName.slice(prefix.length)
  if (valueName.startsWith(prefix) && /^[A-Z]/.test(suffix))
    return suffix

  // Some public components belong to a family without repeating its prefix,
  // for example `Toaster` in the toast entry point.
  return valueName
}

function getPublicComponentExports(
  symbols: Map<string, ts.Symbol>,
  valueNames: Iterable<string>,
  getPartName: (valueName: string) => string,
  checker: ts.TypeChecker,
): PublicComponentExport[] {
  const components = new Map<string, PublicComponentExport>()

  for (const valueName of valueNames) {
    if (!isPublicComponentValue(symbols, valueName, checker))
      continue

    components.set(valueName, {
      partName: getPartName(valueName),
      valueName,
      symbols,
    })
  }

  return [...components.values()].sort((a, b) => a.partName.localeCompare(b.partName))
}

function extractPublicComponentTypes(
  componentExports: PublicComponentExport[],
  checker: ts.TypeChecker,
): ComponentTypesMap {
  const result: ComponentTypesMap = {}

  for (const component of componentExports) {
    const part: PartTypes = {}

    const propsSymbol = component.symbols.get(`${component.valueName}Props`)
    if (propsSymbol) {
      const props = extractExportedProperties(propsSymbol, checker)
      if (Object.keys(props).length > 0)
        part.props = props
    }

    const emitsSymbol = component.symbols.get(`${component.valueName}Emits`)
    if (emitsSymbol) {
      const emits = extractExportedProperties(emitsSymbol, checker)
      if (Object.keys(emits).length > 0)
        part.emits = emits
    }

    // Keep every real public component, including slot-only Vue components
    // whose declarations expose no serializable props or emits.
    result[component.partName] = part
  }

  return result
}

function getNamespaceExports(
  rootExports: Map<string, ts.Symbol>,
  namespaceName: string,
  checker: ts.TypeChecker,
): Map<string, ts.Symbol> {
  const namespace = rootExports.get(namespaceName)
  if (!namespace)
    return new Map()

  const resolved = resolveAliasedSymbol(namespace, checker)
  return new Map(checker.getExportsOfModule(resolved).map(symbol => [symbol.name, symbol]))
}

function getPublicComponentValueNames(publicEntryFile: string): string[] {
  const sourceFile = ts.createSourceFile(
    publicEntryFile,
    fs.readFileSync(publicEntryFile, 'utf8'),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  )
  const names = new Set<string>()

  for (const statement of sourceFile.statements) {
    if (!ts.isExportDeclaration(statement) || statement.isTypeOnly || !statement.exportClause)
      continue
    if (!ts.isNamedExports(statement.exportClause))
      continue
    if (!statement.moduleSpecifier || !ts.isStringLiteral(statement.moduleSpecifier))
      continue
    if (!/(?:^|\/)components(?:\/|$)/.test(statement.moduleSpecifier.text))
      continue

    for (const element of statement.exportClause.elements) {
      if (!element.isTypeOnly)
        names.add(element.name.text)
    }
  }

  return [...names].sort()
}

function getDistFilePath(framework: FrameworkDefinition): string {
  const pkgDir = path.join(rootDir, framework.packageDirectory)
  // Vue uses index.d.ts, React uses index.d.mts
  const candidates = ['dist/index.d.ts', 'dist/index.d.mts']
  for (const candidate of candidates) {
    const fullPath = path.join(pkgDir, candidate)
    if (fs.existsSync(fullPath))
      return fullPath
  }
  throw new Error(
    `No declaration file found for ${framework.id}. Did you build ${framework.packageName} first?`,
  )
}

function getComponentDirs(framework: FrameworkDefinition): { name: string, dir: string }[] {
  const sourceDir = path.join(rootDir, framework.sourceDirectory)
  const dirs: { name: string, dir: string }[] = []
  if (!fs.existsSync(sourceDir))
    throw new Error(`Missing component source directory: ${path.relative(rootDir, sourceDir)}`)

  for (const entry of fs.readdirSync(sourceDir, { withFileTypes: true })) {
    if (!entry.isDirectory())
      continue

    const dir = path.join(sourceDir, entry.name)
    if (!fs.existsSync(path.join(dir, 'examples')))
      continue

    dirs.push({ name: entry.name, dir })
  }

  return dirs.sort((a, b) => a.name.localeCompare(b.name))
}

function getPublicIndexFile(componentDir: string): string {
  const publicIndex = path.join(componentDir, 'index.ts')
  if (!fs.existsSync(publicIndex))
    throw new Error(`Missing public declaration entry: ${path.relative(rootDir, publicIndex)}`)
  return publicIndex
}

async function extractTypesForFramework(framework: FrameworkDefinition) {
  const distFile = getDistFilePath(framework)
  const pkgDir = path.join(rootDir, framework.packageDirectory)
  const outDir = path.join(rootDir, 'docs', 'src', 'data', 'types', framework.id)
  const componentDirs = getComponentDirs(framework)

  console.log(`Reading declarations from ${path.relative(rootDir, distFile)}`)

  // Create a TypeScript program to parse the dist declaration file
  const configPath = path.join(pkgDir, 'tsconfig.json')
  const configFile = ts.readConfigFile(configPath, ts.sys.readFile)
  if (configFile.error)
    throw new Error(ts.flattenDiagnosticMessageText(configFile.error.messageText, '\n'))

  const parsedConfig = ts.parseJsonConfigFileContent(configFile.config, ts.sys, pkgDir)
  if (parsedConfig.errors.length > 0) {
    throw new Error(parsedConfig.errors.map(error => ts.flattenDiagnosticMessageText(error.messageText, '\n')).join('\n'))
  }

  const program = ts.createProgram([distFile], {
    ...parsedConfig.options,
    noEmit: true,
    declaration: false,
    emitDeclarationOnly: false,
  })

  const checker = program.getTypeChecker()
  const rootExports = getModuleExports(program, checker, distFile)

  let count = 0
  const missingTypes: string[] = []
  fs.rmSync(outDir, { recursive: true, force: true })
  fs.mkdirSync(outDir, { recursive: true })

  for (const comp of componentDirs) {
    const prefix = kebabToPascal(comp.name)
    const types: ComponentTypesMap = {}
    const namespaceExports = getNamespaceExports(rootExports, prefix, checker)
    const publicNamespace = path.join(comp.dir, 'namespace.ts')
    const namespaceComponents = getPublicComponentExports(
      namespaceExports,
      fs.existsSync(publicNamespace) ? getPublicComponentValueNames(publicNamespace) : [],
      valueName => valueName,
      checker,
    )
    mergeComponentTypes(types, extractPublicComponentTypes(namespaceComponents, checker))

    const publicIndex = getPublicIndexFile(comp.dir)
    const directComponents = getPublicComponentExports(
      rootExports,
      getPublicComponentValueNames(publicIndex),
      valueName => getOwnedPartName(valueName, prefix),
      checker,
    )
    mergeComponentTypes(types, extractPublicComponentTypes(directComponents, checker))

    if (Object.keys(types).length === 0) {
      missingTypes.push(comp.name)
      continue
    }

    const outPath = path.join(outDir, `${comp.name}.types.json`)
    fs.writeFileSync(outPath, `${JSON.stringify(types, null, 2)}\n`)
    count++
    console.log(`  ✓ ${comp.name} (${Object.keys(types).length} parts)`)
  }

  if (missingTypes.length > 0) {
    throw new Error(`No public component types found for: ${missingTypes.join(', ')}`)
  }

  console.log(`\nGenerated ${count} type files → ${path.relative(rootDir, outDir)}/`)
}

// ---------------------------------------------------------------------------
// CLI entry
// ---------------------------------------------------------------------------

async function main() {
  validatePropertyExtractionRegression()

  const frameworkId = process.argv[2]
  let selectedFrameworks: readonly FrameworkDefinition[] = frameworks
  if (frameworkId) {
    if (!isFramework(frameworkId))
      throw new Error(`Unsupported framework: ${frameworkId}`)
    selectedFrameworks = [getFramework(frameworkId)]
  }

  for (const framework of selectedFrameworks) {
    const pkgDir = path.join(rootDir, framework.packageDirectory)
    if (!fs.existsSync(pkgDir))
      throw new Error(`Package not found: ${framework.packageDirectory}`)

    console.log(`Generating type docs for ${framework.id}...\n`)
    await extractTypesForFramework(framework)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
