import type { FrameworkDefinition } from '../src/config/frameworks'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'
import { componentCategories } from '../src/config/catalog'
import { frameworks } from '../src/config/frameworks'

interface PartTypes {
  props?: Record<string, unknown>
  emits?: Record<string, unknown>
}

type ComponentTypes = Record<string, PartTypes>

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '../..')
const componentDocsDir = path.join(rootDir, 'docs/src/content/docs/components')
const failures: string[] = []
const typeCache = new Map<string, ComponentTypes | null>()

const catalogComponents = Object.values(componentCategories)
  .flat()
  .map(component => component.slug)
  .sort()

function check(condition: boolean, message: string): void {
  if (!condition)
    failures.push(message)
}

function sameValues(left: readonly string[], right: readonly string[]): boolean {
  return JSON.stringify([...left].sort()) === JSON.stringify([...right].sort())
}

function kebabToPascal(value: string): string {
  return value
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')
}

function getOwnedPartName(valueName: string, prefix: string): string {
  if (valueName === prefix)
    return 'Root'
  const suffix = valueName.slice(prefix.length)
  return valueName.startsWith(prefix) && /^[A-Z]/.test(suffix) ? suffix : valueName
}

function readTypes(framework: FrameworkDefinition, component: string): ComponentTypes | null {
  const cacheKey = `${framework.id}/${component}`
  if (typeCache.has(cacheKey))
    return typeCache.get(cacheKey) ?? null

  const file = path.join(rootDir, 'docs/src/data/types', framework.id, `${component}.types.json`)
  if (!fs.existsSync(file)) {
    failures.push(`${framework.id}: missing generated type data for ${component}`)
    typeCache.set(cacheKey, null)
    return null
  }

  try {
    const types = JSON.parse(fs.readFileSync(file, 'utf8')) as ComponentTypes
    typeCache.set(cacheKey, types)
    return types
  }
  catch (error) {
    failures.push(`${framework.id}: invalid JSON for ${component}: ${String(error)}`)
    typeCache.set(cacheKey, null)
    return null
  }
}

function getDocumentedComponents(): string[] {
  return fs.readdirSync(componentDocsDir)
    .filter(file => file.endsWith('.mdx'))
    .map(file => file.slice(0, -'.mdx'.length))
    .sort()
}

function getSourceComponents(framework: FrameworkDefinition): string[] {
  const sourceDir = path.join(rootDir, framework.sourceDirectory)
  return fs.readdirSync(sourceDir, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name)
    .filter(component => fs.existsSync(path.join(sourceDir, component, 'examples')))
    .sort()
}

function getGeneratedComponents(framework: FrameworkDefinition): string[] {
  const typeDir = path.join(rootDir, 'docs/src/data/types', framework.id)
  return fs.readdirSync(typeDir)
    .filter(file => file.endsWith('.types.json'))
    .map(file => file.slice(0, -'.types.json'.length))
    .sort()
}

function validateAutomaticApiReference(component: string): void {
  const source = fs.readFileSync(path.join(componentDocsDir, `${component}.mdx`), 'utf8')
  const calls = [...source.matchAll(/<ComponentTypes\b([^>]*)\/>/g)]

  check(calls.length === 1, `${component}: expected exactly one automatic ComponentTypes reference`)
  for (const match of calls) {
    const attributes = Object.fromEntries(
      [...match[1].matchAll(/([a-z]+)="([^"]+)"/gi)].map(attribute => [attribute[1], attribute[2]]),
    )
    check(attributes.id === component, `${component}: ComponentTypes id must match the component page`)
    check(!attributes.part, `${component}: ComponentTypes must render every public part automatically`)
  }
}

function readPublicComponentValueNames(file: string): Set<string> {
  if (!fs.existsSync(file))
    return new Set()

  const sourceFile = ts.createSourceFile(
    file,
    fs.readFileSync(file, 'utf8'),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  )
  const values = new Set<string>()

  for (const statement of sourceFile.statements) {
    if (!ts.isExportDeclaration(statement) || statement.isTypeOnly || !statement.exportClause)
      continue
    if (!ts.isNamedExports(statement.exportClause))
      continue
    for (const element of statement.exportClause.elements) {
      if (!element.isTypeOnly && /^[A-Z]/.test(element.name.text))
        values.add(element.name.text)
    }
  }

  return values
}

function readPublicNamespaceValueNames(file: string): Set<string> {
  if (!fs.existsSync(file))
    return new Set()

  const sourceFile = ts.createSourceFile(
    file,
    fs.readFileSync(file, 'utf8'),
    ts.ScriptTarget.Latest,
    true,
    file.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  )
  const values = new Set<string>()
  for (const statement of sourceFile.statements) {
    if (!ts.isExportDeclaration(statement) || statement.isTypeOnly || !statement.exportClause)
      continue
    if (!ts.isNamedExports(statement.exportClause))
      continue
    for (const element of statement.exportClause.elements) {
      if (!element.isTypeOnly && /^[A-Z]/.test(element.name.text))
        values.add(element.name.text)
    }
  }
  return values
}

function getPublicParts(framework: FrameworkDefinition, component: string): Set<string> {
  const componentDir = path.join(rootDir, framework.sourceDirectory, component)
  const prefix = kebabToPascal(component)
  const parts = new Set<string>()

  const namespaceFile = ['namespace.ts', `${component}.ts`]
    .map(fileName => path.join(componentDir, fileName))
    .find(fileName => fs.existsSync(fileName))
  for (const valueName of namespaceFile ? readPublicNamespaceValueNames(namespaceFile) : [])
    parts.add(valueName)
  const indexFile = ['index.ts', 'index.tsx']
    .map(fileName => path.join(componentDir, fileName))
    .find(fileName => fs.existsSync(fileName))
  for (const valueName of indexFile ? readPublicComponentValueNames(indexFile) : [])
    parts.add(getOwnedPartName(valueName, prefix))
  return parts
}

function validateGeneratedResults(): void {
  const documented = getDocumentedComponents()
  check(
    sameValues(documented, catalogComponents),
    `Component docs and catalog differ (docs=${documented.length}, catalog=${catalogComponents.length})`,
  )

  for (const component of catalogComponents)
    validateAutomaticApiReference(component)

  const frameworkPartCounts = new Map<string, number>()
  for (const framework of frameworks) {
    const sourceComponents = getSourceComponents(framework)
    const generatedComponents = getGeneratedComponents(framework)
    check(
      sameValues(sourceComponents, catalogComponents),
      `${framework.id}: public source components differ from the catalog`,
    )
    check(
      sameValues(generatedComponents, catalogComponents),
      `${framework.id}: generated type files differ from the catalog`,
    )

    let frameworkPartCount = 0
    for (const component of catalogComponents) {
      const types = readTypes(framework, component)
      if (!types)
        continue

      const publicParts = getPublicParts(framework, component)
      const generatedParts = Object.keys(types)
      const expectedParts = [...publicParts]
      frameworkPartCount += generatedParts.length
      check(generatedParts.length > 0, `${framework.id}/${component}: generated type data is empty`)
      check(
        sameValues(generatedParts, expectedParts),
        `${framework.id}/${component}: generated public parts differ from namespace/index `
        + `(missing=${expectedParts.filter(part => !generatedParts.includes(part)).join(',') || 'none'}; `
        + `unexpected=${generatedParts.filter(part => !publicParts.has(part)).join(',') || 'none'})`,
      )

      for (const [partName, part] of Object.entries(types)) {
        check(
          !('dataAttr' in part),
          `${framework.id}/${component}.${partName}: data attributes require a declaration-backed source`,
        )
      }
    }
    frameworkPartCounts.set(framework.id, frameworkPartCount)

    const checkbox = readTypes(framework, 'checkbox')
    check(!checkbox?.GroupItem && !checkbox?.Item, `${framework.id}/checkbox: ghost item parts must not be generated`)

    const toggle = readTypes(framework, 'toggle')
    check(
      !Object.keys(toggle ?? {}).some(part => part.startsWith('Group')),
      `${framework.id}/toggle: toggle-group parts must stay in the toggle-group component`,
    )

    const toast = readTypes(framework, 'toast')
    check(!!toast?.Toaster, `${framework.id}/toast: public Toaster API is missing`)
    check(!toast?.er && !toast?.erItem, `${framework.id}/toast: truncated er/erItem names must not be generated`)
  }

  if (failures.length > 0) {
    console.error(`Type docs validation failed (${failures.length}):`)
    for (const failure of failures)
      console.error(`  - ${failure}`)
    process.exit(1)
  }

  console.log([
    `Type docs validation passed: ${catalogComponents.length} components`,
    ...frameworks.map(framework => `${framework.id} ${frameworkPartCounts.get(framework.id) ?? 0} public parts`),
    `${catalogComponents.length} automatic API references`,
  ].join(', '))
}

validateGeneratedResults()
