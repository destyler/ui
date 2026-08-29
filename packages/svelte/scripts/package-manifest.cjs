const fs = require('node:fs')
const path = require('node:path')
const process = require('node:process')

const GENERATED_HEADER = '// Generated from package-manifest.json. Do not edit by hand.\n'
const PACKAGE_ROOT_ENV = 'DESTYLER_SVELTE_PACKAGE_ROOT'

function getPackageRoot() {
  return process.env[PACKAGE_ROOT_ENV]
    ? path.resolve(process.env[PACKAGE_ROOT_ENV])
    : path.resolve(__dirname, '..')
}

function getPaths(packageRoot = getPackageRoot()) {
  const componentsRoot = path.join(packageRoot, 'src/lib/components')
  const providersRoot = path.join(packageRoot, 'src/lib/providers')
  return {
    packageRoot,
    componentsRoot,
    providersRoot,
    manifest: path.join(packageRoot, 'package-manifest.json'),
    componentBarrel: path.join(componentsRoot, 'index.ts'),
    componentCategories: path.join(componentsRoot, 'component-categories.ts'),
    providerBarrel: path.join(providersRoot, 'index.ts'),
    providerCategories: path.join(providersRoot, 'provider-categories.ts'),
    packageJson: path.join(packageRoot, 'package.json'),
    preview: path.join(packageRoot, '.storybook/preview.ts'),
  }
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'))
}

function readManifest(packageRoot = getPackageRoot()) {
  const manifest = readJson(getPaths(packageRoot).manifest)
  validateManifest(manifest)
  return manifest
}

function validateManifest(manifest) {
  if (
    !manifest
    || !Array.isArray(manifest.componentCategories)
    || !Array.isArray(manifest.components)
    || !Array.isArray(manifest.providerCategories)
    || !Array.isArray(manifest.providers)
  ) {
    throw new TypeError('package-manifest.json must contain component and provider categories and entries')
  }

  const categories = new Set()
  for (const category of manifest.componentCategories) {
    if (typeof category !== 'string' || !category.trim())
      throw new TypeError('Every component category must be a non-empty string')
    if (categories.has(category))
      throw new TypeError(`Duplicate component category: ${category}`)
    categories.add(category)
  }

  const providerCategories = new Set()
  for (const category of manifest.providerCategories) {
    if (typeof category !== 'string' || !category.trim())
      throw new TypeError('Every provider category must be a non-empty string')
    if (providerCategories.has(category))
      throw new TypeError(`Duplicate provider category: ${category}`)
    providerCategories.add(category)
  }

  const slugs = new Set()
  const names = new Set()
  const namespaces = new Set()
  for (const component of manifest.components) {
    if (!component || typeof component !== 'object')
      throw new TypeError('Every component manifest entry must be an object')
    if (typeof component.name !== 'string' || !component.name.trim())
      throw new TypeError('Every component must have a non-empty display name')
    if (!/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(component.slug))
      throw new TypeError(`Invalid component slug: ${component.slug}`)
    if (!/^[A-Z][A-Za-z0-9]*$/.test(component.namespace))
      throw new TypeError(`Invalid component namespace: ${component.namespace}`)
    if (!categories.has(component.category))
      throw new TypeError(`Unknown category for ${component.slug}: ${component.category}`)
    if (component.anatomy !== null && !/^[a-z][A-Za-z0-9]*Anatomy$/.test(component.anatomy))
      throw new TypeError(`Invalid anatomy export for ${component.slug}: ${component.anatomy}`)
    if (component.namespaceBarrel !== undefined && typeof component.namespaceBarrel !== 'boolean')
      throw new TypeError(`namespaceBarrel must be boolean for ${component.slug}`)
    if (component.anatomyExceptions !== undefined) {
      if (component.anatomy === null || !Array.isArray(component.anatomyExceptions))
        throw new TypeError(`Invalid anatomy exceptions for ${component.slug}`)
      for (const exception of component.anatomyExceptions) {
        if (!/^[A-Z][A-Za-z0-9]*$/.test(exception))
          throw new TypeError(`Invalid anatomy exception for ${component.slug}: ${exception}`)
      }
      if (new Set(component.anatomyExceptions).size !== component.anatomyExceptions.length)
        throw new TypeError(`Duplicate anatomy exception for ${component.slug}`)
    }

    for (const [value, seen, label] of [
      [component.slug, slugs, 'slug'],
      [component.name, names, 'name'],
      [component.namespace, namespaces, 'namespace'],
    ]) {
      if (seen.has(value))
        throw new TypeError(`Duplicate component ${label}: ${value}`)
      seen.add(value)
    }
  }

  const providerSlugs = new Set()
  const providerNames = new Set()
  const publicSubpaths = new Set(slugs)
  for (const provider of manifest.providers) {
    if (!provider || typeof provider !== 'object')
      throw new TypeError('Every provider manifest entry must be an object')
    if (typeof provider.name !== 'string' || !provider.name.trim())
      throw new TypeError('Every provider must have a non-empty display name')
    if (!/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(provider.slug))
      throw new TypeError(`Invalid provider slug: ${provider.slug}`)
    if (!providerCategories.has(provider.category))
      throw new TypeError(`Unknown category for ${provider.slug}: ${provider.category}`)
    if (providerSlugs.has(provider.slug))
      throw new TypeError(`Duplicate provider slug: ${provider.slug}`)
    if (publicSubpaths.has(provider.slug))
      throw new TypeError(`Duplicate package subpath: ${provider.slug}`)
    if (providerNames.has(provider.name))
      throw new TypeError(`Duplicate provider name: ${provider.name}`)
    providerSlugs.add(provider.slug)
    publicSubpaths.add(provider.slug)
    providerNames.add(provider.name)
  }

  return manifest
}

function quote(value) {
  return `'${value.replaceAll('\\', '\\\\').replaceAll('\'', '\\\'')}'`
}

function propertyKey(value) {
  return /^[a-z_$][\w$]*$/i.test(value) ? value : quote(value)
}

function buildBarrel(entries) {
  const exports = entries.map(entry => entry.slug)
    .toSorted((left, right) => left.localeCompare(right))
    .map(slug => `export * from './${slug}'`)
  return `${GENERATED_HEADER}${exports.join('\n')}\n`
}

function buildCategories(categories, entries, exportName, typeName) {
  const lines = [`${GENERATED_HEADER}export const ${exportName} = {`]
  for (const category of categories) {
    lines.push(`  ${propertyKey(category)}: [`)
    for (const entry of entries.filter(entry => entry.category === category))
      lines.push(`    { name: ${quote(entry.name)}, slug: ${quote(entry.slug)} },`)
    lines.push('  ],')
  }
  lines.push('} as const')
  lines.push('')
  lines.push(`export type ${typeName} = keyof typeof ${exportName}`)
  lines.push('')
  return lines.join('\n')
}

function isGeneratedPackageExport(key, value) {
  if (key === './*')
    return true
  return Boolean(
    value
    && typeof value === 'object'
    && typeof value.types === 'string'
    && typeof value.svelte === 'string'
    && /^\.\/dist\/(?:components|providers)\/[^/]+\/index\.d\.ts$/.test(value.types)
    && /^\.\/dist\/(?:components|providers)\/[^/]+\/index\.js$/.test(value.svelte),
  )
}

function buildPackageJson(manifest, currentPackageJson) {
  const exports = {}
  for (const [key, value] of Object.entries(currentPackageJson.exports ?? {})) {
    if (!isGeneratedPackageExport(key, value))
      exports[key] = value
  }
  for (const provider of manifest.providers.toSorted((left, right) => left.slug.localeCompare(right.slug))) {
    exports[`./${provider.slug}`] = {
      types: `./dist/providers/${provider.slug}/index.d.ts`,
      svelte: `./dist/providers/${provider.slug}/index.js`,
    }
  }
  for (const component of manifest.components.toSorted((left, right) => left.slug.localeCompare(right.slug))) {
    exports[`./${component.slug}`] = {
      types: `./dist/components/${component.slug}/index.d.ts`,
      svelte: `./dist/components/${component.slug}/index.js`,
    }
  }
  return `${JSON.stringify({ ...currentPackageJson, exports }, null, 2)}\n`
}

function buildStorybookPreview(manifest) {
  const categoryOrder = manifest.componentCategories.map(category => quote(category)).join(', ')
  const providerCategoryOrder = manifest.providerCategories.map(category => quote(category)).join(', ')
  return `${GENERATED_HEADER}import type { Preview } from '@storybook/svelte-vite'

import '../../../utils/bootstrap.css'

const preview: Preview = {
  parameters: {
    options: {
      storySort: {
        order: [
          'Components',
          [${categoryOrder}],
          'Providers',
          [${providerCategoryOrder}],
        ],
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      codePanel: true,
    },
    a11y: {
      test: 'todo',
    },
  },
}

export default preview
`
}

function buildArtifacts(manifest, packageRoot = getPackageRoot()) {
  validateManifest(manifest)
  const paths = getPaths(packageRoot)
  const packageJson = readJson(paths.packageJson)
  return new Map([
    [paths.componentBarrel, buildBarrel(manifest.components)],
    [paths.componentCategories, buildCategories(
      manifest.componentCategories,
      manifest.components,
      'componentCategories',
      'ComponentCategory',
    )],
    [paths.providerBarrel, buildBarrel(manifest.providers)],
    [paths.providerCategories, buildCategories(
      manifest.providerCategories,
      manifest.providers,
      'providerCategories',
      'ProviderCategory',
    )],
    [paths.packageJson, buildPackageJson(manifest, packageJson)],
    [paths.preview, buildStorybookPreview(manifest)],
  ])
}

function formatManifest(manifest) {
  validateManifest(manifest)
  return `${JSON.stringify(manifest, null, 2)}\n`
}

function syncArtifacts({ check = false, packageRoot = getPackageRoot() } = {}) {
  const manifest = readManifest(packageRoot)
  const mismatches = []
  for (const [file, expected] of buildArtifacts(manifest, packageRoot)) {
    const actual = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : ''
    if (actual === expected)
      continue
    mismatches.push(path.relative(packageRoot, file))
    if (!check)
      fs.writeFileSync(file, expected)
  }
  if (check && mismatches.length > 0)
    throw new Error(`Generated package artifacts are stale: ${mismatches.join(', ')}. Run pnpm sync:manifest.`)
  return mismatches
}

function insertComponent(manifest, component) {
  const next = structuredClone(manifest)
  const lastCategoryIndex = next.components.findLastIndex(entry => entry.category === component.category)
  next.components.splice(lastCategoryIndex + 1, 0, component)
  validateManifest(next)
  return next
}

function listTemplateFiles(root) {
  const files = []
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    const absolute = path.join(root, entry.name)
    if (entry.isDirectory())
      files.push(...listTemplateFiles(absolute))
    else if (entry.isFile() && entry.name.endsWith('.hbs'))
      files.push(absolute)
  }
  return files
}

function renderComponentTemplates({ answers, plopApi, stageRoot, templateRoot }) {
  for (const templateFile of listTemplateFiles(templateRoot)) {
    const relativeTemplate = path.relative(templateRoot, templateFile)
    const relativeOutput = plopApi.renderString(relativeTemplate.slice(0, -4), answers)
    if (relativeOutput.startsWith('..') || path.isAbsolute(relativeOutput))
      throw new Error(`Unsafe generated path: ${relativeOutput}`)
    const output = path.join(stageRoot, relativeOutput)
    fs.mkdirSync(path.dirname(output), { recursive: true })
    const rendered = plopApi.renderString(fs.readFileSync(templateFile, 'utf8'), answers)
    if (/\{\{[^}]+\}\}/.test(rendered))
      throw new Error(`Unresolved template expression in ${relativeTemplate}`)
    fs.writeFileSync(output, rendered)
  }
}

function generateComponent({ answers, plopApi, packageRoot = getPackageRoot(), templateRoot }) {
  const manifest = readManifest(packageRoot)
  const paths = getPaths(packageRoot)
  const component = {
    name: answers.name.trim(),
    namespace: answers.namespace.trim(),
    slug: answers.svelte.trim(),
    category: answers.category,
    anatomy: null,
  }
  const nextManifest = insertComponent(manifest, component)
  const target = path.join(paths.componentsRoot, component.slug)
  if (fs.existsSync(target))
    throw new Error(`Component directory already exists: ${component.slug}`)

  const stageRoot = fs.mkdtempSync(path.join(paths.componentsRoot, '.generate-'))
  const replacements = new Map([
    [paths.manifest, formatManifest(nextManifest)],
    ...buildArtifacts(nextManifest, packageRoot),
  ])
  const originals = new Map([...replacements.keys()].map(file => [file, fs.readFileSync(file, 'utf8')]))
  const temporaryFiles = []
  let targetCreated = false

  try {
    renderComponentTemplates({ answers, plopApi, stageRoot, templateRoot })
    for (const [file, content] of replacements) {
      const temporaryFile = path.join(path.dirname(file), `.${path.basename(file)}.${process.pid}.${Date.now()}.tmp`)
      fs.writeFileSync(temporaryFile, content)
      temporaryFiles.push([temporaryFile, file])
    }

    fs.renameSync(stageRoot, target)
    targetCreated = true
    for (const [temporaryFile, file] of temporaryFiles)
      fs.renameSync(temporaryFile, file)
  }
  catch (error) {
    for (const [file, content] of originals)
      fs.writeFileSync(file, content)
    if (targetCreated)
      fs.rmSync(target, { recursive: true, force: true })
    throw error
  }
  finally {
    fs.rmSync(stageRoot, { recursive: true, force: true })
    for (const [temporaryFile] of temporaryFiles)
      fs.rmSync(temporaryFile, { force: true })
  }

  return path.relative(process.cwd(), target)
}

function defaultDisplayName(slug) {
  return slug.trim().split('-').filter(Boolean).map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ')
}

function defaultNamespace(slug) {
  return slug.trim().split('-').filter(Boolean).map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('')
}

function validateSlug(value, packageRoot = getPackageRoot()) {
  const slug = value.trim()
  if (!/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(slug))
    return 'Use kebab-case starting with a letter, for example date-picker.'
  const manifest = readManifest(packageRoot)
  if (manifest.components.some(component => component.slug === slug))
    return `Component already exists in the manifest: ${slug}`
  if (manifest.providers.some(provider => provider.slug === slug))
    return `Package subpath is already used by a provider: ${slug}`
  if (fs.existsSync(path.join(getPaths(packageRoot).componentsRoot, slug)))
    return `Component directory already exists: ${slug}`
  return true
}

function validateDisplayName(value, packageRoot = getPackageRoot()) {
  const name = value.trim()
  if (!/^[a-z0-9][a-z0-9 +/&.-]*$/i.test(name))
    return 'Use a plain display name without quotes or template characters.'
  if (readManifest(packageRoot).components.some(component => component.name === name))
    return `Component display name already exists: ${name}`
  return true
}

function validateNamespace(value, packageRoot = getPackageRoot()) {
  const namespace = value.trim()
  if (!/^[A-Z][A-Za-z0-9]*$/.test(namespace))
    return 'Use a PascalCase TypeScript identifier, for example DatePicker.'
  if (readManifest(packageRoot).components.some(component => component.namespace === namespace))
    return `Component namespace already exists: ${namespace}`
  return true
}

module.exports = {
  PACKAGE_ROOT_ENV,
  buildArtifacts,
  defaultDisplayName,
  defaultNamespace,
  formatManifest,
  generateComponent,
  getPackageRoot,
  getPaths,
  readManifest,
  syncArtifacts,
  validateDisplayName,
  validateManifest,
  validateNamespace,
  validateSlug,
}
