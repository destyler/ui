import { describe, expect, it } from 'vitest'
import packageJson from '../package.json'
import * as solidRoot from '../src/index'

type ModuleExports = Record<string, unknown>

interface BuildExport {
  default: string
  import: string
  solid: string
  types: string
}

interface ConditionalExport extends BuildExport {
  source?: string
}

interface ExpandedSubpath {
  exportMap: BuildExport
  source: string
  subpath: string
}

const reactComponentIndexes = import.meta.glob('../../react/src/components/*/index.ts', {
  import: 'default',
  query: '?raw',
})
const reactProviderIndexes = import.meta.glob('../../react/src/providers/*/index.ts', {
  import: 'default',
  query: '?raw',
})
const solidComponentEntries = import.meta.glob('../src/components/*/index.ts', {
  eager: true,
}) as Record<string, ModuleExports>
const solidProviderEntries = import.meta.glob([
  '../src/providers/*/index.ts',
], { eager: true }) as Record<string, ModuleExports>
const infrastructureEntries = import.meta.glob([
  '../src/anatomy.ts',
  '../src/utils/collection.ts',
  '../src/factory/index.tsx',
], { eager: true }) as Record<string, ModuleExports>

const reactExamples = import.meta.glob('../../react/src/components/*/examples/**/*.tsx', {
  import: 'default',
  query: '?raw',
})
const solidExamples = import.meta.glob('../src/components/*/examples/**/*.tsx')
const solidComponentFiles = import.meta.glob('../src/components/**/*.{ts,tsx}')
const solidProviderFiles = import.meta.glob('../src/providers/**/*.{ts,tsx}')
const solidTemplateFiles = import.meta.glob('../../../template/solid/**/*')

const reactComponentIndexSources = import.meta.glob(
  '../../react/src/components/*/index.ts',
  {
    eager: true,
    import: 'default',
    query: '?raw',
  },
) as Record<string, string>
const solidComponentIndexSources = import.meta.glob(
  '../src/components/*/index.ts',
  {
    eager: true,
    import: 'default',
    query: '?raw',
  },
) as Record<string, string>
const reactNamespaceSources = import.meta.glob(
  '../../react/src/components/*/namespace.ts',
  {
    eager: true,
    import: 'default',
    query: '?raw',
  },
) as Record<string, string>

const packageExports = packageJson.exports as Record<
  string,
  ConditionalExport | string
>

function slugFromEntry(path: string, section: 'components' | 'providers') {
  const slug = path.match(new RegExp(`/${section}/([^/]+)/index\\.tsx?$`))?.[1]
  if (!slug)
    throw new Error(`Cannot read ${section} slug from ${path}`)
  return slug
}

function slugsFromEntries(
  entries: Record<string, unknown>,
  section: 'components' | 'providers',
) {
  return Object.keys(entries).map(path => slugFromEntry(path, section)).toSorted()
}

function examplesByComponent(paths: string[], framework: 'React' | 'Solid') {
  const result = new Map<string, string[]>()
  for (const path of paths) {
    const match = path.match(/\/components\/([^/]+)\/examples\/(.+)\.tsx$/)
    if (!match)
      throw new Error(`Cannot read ${framework} example path from ${path}`)
    const [, slug, filename] = match
    const examples = result.get(slug) ?? []
    examples.push(filename)
    result.set(slug, examples)
  }
  for (const examples of result.values()) examples.sort()
  return result
}

function sourceBySlug(sources: Record<string, string>, filename: string) {
  const result = new Map<string, string>()
  for (const [path, source] of Object.entries(sources)) {
    const slug = path.match(new RegExp(`/components/([^/]+)/${filename}$`))?.[1]
    if (slug)
      result.set(slug, source)
  }
  return result
}

function namespaceName(indexSource: string) {
  return indexSource.match(
    /export\s+\*\s+as\s+([A-Za-z_$][\w$]*)\s+from\s+['"]\.\/namespace['"]/,
  )?.[1]
}

function runtimeExports(source: string) {
  const names = new Set<string>()
  for (const match of source.matchAll(
    /export\s*\{([\s\S]*?)\}\s*from\s*['"][^'"]+['"]/g,
  )) {
    for (const specifier of match[1].split(',')) {
      const value = specifier.trim()
      if (!value || value.startsWith('type '))
        continue
      names.add(value.split(/\s+as\s+/).at(-1)!)
    }
  }
  return [...names].toSorted()
}

function typeExports(source: string) {
  const names = new Set<string>()
  for (const match of source.matchAll(
    /export\s+(type\s+)?\{([\s\S]*?)\}\s*from\s*['"][^'"]+['"]/g,
  )) {
    const declarationIsTypeOnly = !!match[1]
    for (const specifier of match[2].split(',')) {
      const value = specifier.trim()
      if (!value || (!declarationIsTypeOnly && !value.startsWith('type ')))
        continue
      names.add(value.replace(/^type\s+/, '').split(/\s+as\s+/).at(-1)!)
    }
  }
  return [...names].toSorted()
}

function componentEntry(slug: string) {
  const entry = Object.entries(solidComponentEntries)
    .find(([path]) => path.endsWith(`/components/${slug}/index.ts`))?.[1]
  if (!entry)
    throw new Error(`Missing Solid component entry: ${slug}/index.ts`)
  return entry
}

function conditionalExport(subpath: string) {
  const value = packageExports[subpath]
  if (!value || typeof value === 'string')
    throw new Error(`Missing conditional package export: ${subpath}`)
  return value
}

function applyWildcard(value: string, slug: string) {
  return value.replace('*', slug)
}

function expandedSubpaths(componentSlugs: string[], providerSlugs: string[]) {
  const result: ExpandedSubpath[] = []
  const add = (
    subpath: string,
    exportMap: ConditionalExport,
    slug?: string,
    sourceOverride?: string,
  ) => {
    const expand = (value: string) => slug ? applyWildcard(value, slug) : value
    const source = sourceOverride ?? (exportMap.source && expand(exportMap.source))
    if (!source)
      throw new Error(`Missing source target for ${subpath}`)
    result.push({
      exportMap: {
        default: expand(exportMap.default),
        import: expand(exportMap.import),
        solid: expand(exportMap.solid),
        types: expand(exportMap.types),
      },
      source,
      subpath,
    })
  }

  add('.', conditionalExport('.'), undefined, './src/index.ts')
  add('./anatomy', conditionalExport('./anatomy'), undefined, './src/anatomy.ts')
  add('./collection', conditionalExport('./collection'), undefined, './src/utils/collection.ts')
  add('./factory', conditionalExport('./factory'), undefined, './src/factory/index.tsx')
  for (const slug of providerSlugs)
    add(`./${slug}`, conditionalExport(`./${slug}`), undefined, `./src/providers/${slug}/index.ts`)

  const componentExport = conditionalExport('./*')
  for (const slug of componentSlugs)
    add(`./${slug}`, componentExport, slug, `./src/components/${slug}/index.ts`)

  return result
}

describe('solid package structure parity', () => {
  const reactComponents = slugsFromEntries(reactComponentIndexes, 'components')
  const solidComponents = slugsFromEntries(solidComponentEntries, 'components')
  const reactProviders = slugsFromEntries(reactProviderIndexes, 'providers')
  const solidProviders = slugsFromEntries(solidProviderEntries, 'providers')

  it('matches all 46 React component directories', () => {
    expect(reactComponents, 'React component baseline changed').toHaveLength(46)
    expect(
      solidComponents,
      `Solid component directories differ from React. React: ${reactComponents.join(', ')}`,
    ).toEqual(reactComponents)
  })

  it('matches all 7 React provider directories', () => {
    expect(reactProviders, 'React provider baseline changed').toHaveLength(7)
    expect(
      solidProviders,
      `Solid provider directories differ from React. React: ${reactProviders.join(', ')}`,
    ).toEqual(reactProviders)
  })

  const reactExamplesByComponent = examplesByComponent(
    Object.keys(reactExamples),
    'React',
  )
  const solidExamplesByComponent = examplesByComponent(
    Object.keys(solidExamples),
    'Solid',
  )

  it.each(reactComponents)('%s includes every React example filename', (slug) => {
    const expected = reactExamplesByComponent.get(slug) ?? []
    const actual = new Set(solidExamplesByComponent.get(slug) ?? [])
    const missing = expected.filter(filename => !actual.has(filename))

    expect(
      missing,
      `${slug}: missing ${missing.length} React example file(s): ${missing.join(', ')}`,
    ).toEqual([])
  })

  it('organizes every component like React and Vue', () => {
    const paths = Object.keys(solidComponentFiles)
    const failures = solidComponents.flatMap((slug) => {
      const prefix = `../src/components/${slug}/`
      const files = paths.filter(path => path.startsWith(prefix)).map(path => path.slice(prefix.length))
      const rootFiles = files.filter(file => !file.includes('/')).toSorted()
      const expectedRootFiles = slug === 'presence'
        ? ['index.ts']
        : ['anatomy.ts', 'index.ts', 'namespace.ts']
      const missingDirectories = ['components', 'examples', 'hooks', 'stories', 'test']
        .filter(directory => !files.some(file => file.startsWith(`${directory}/`)))
      const issues: string[] = []
      if (JSON.stringify(rootFiles) !== JSON.stringify(expectedRootFiles))
        issues.push(`${slug}: root files are ${rootFiles.join(', ')}`)
      if (missingDirectories.length)
        issues.push(`${slug}: missing ${missingDirectories.join(', ')}`)
      return issues
    })

    const componentParts = paths.filter(path => /\/components\/[^/]+\/components\/[^/]+\.(?:ts|tsx)$/.test(path))
    expect(componentParts, 'Solid must keep exactly 468 public component part files').toHaveLength(468)
    expect(failures, failures.join('\n')).toEqual([])
  })

  it('keeps provider stories and tests out of provider roots', () => {
    const paths = Object.keys(solidProviderFiles)
    const flatStoriesOrTests = paths.filter(path => /\/providers\/[^/]+\/[^/]+\.(?:stories|test)\.[^/]+$/.test(path))
    const stories = paths.filter(path => /\/providers\/[^/]+\/stories\/[^/]+\.stories\.[^/]+$/.test(path))

    expect(flatStoriesOrTests).toEqual([])
    expect(stories).toHaveLength(7)
    expect(paths).toContain('../src/providers/frame/components/Frame.tsx')
    expect(paths).toContain('../src/providers/frame/components/Content.tsx')
  })

  it('generates new Solid components with the same directory layout', () => {
    const paths = Object.keys(solidTemplateFiles).map(path => path.replace('../../../template/solid/', '')).toSorted()
    expect(paths).toEqual([
      'anatomy.ts.hbs',
      'components/Root.tsx.hbs',
      'examples/Basic.tsx.hbs',
      'hooks/index.ts.hbs',
      'index.ts.hbs',
      'namespace.ts.hbs',
      'stories/{{dashCase solid}}.stories.tsx.hbs',
      'test/{{dashCase solid}}.test.tsx.hbs',
    ])
  })
})

describe('solid public component API parity', () => {
  const reactIndexes = sourceBySlug(reactComponentIndexSources, 'index\\.ts')
  const solidIndexes = sourceBySlug(solidComponentIndexSources, 'index\\.ts')
  const reactNamespaces = sourceBySlug(reactNamespaceSources, 'namespace\\.ts')
  const componentSlugs = slugsFromEntries(reactComponentIndexes, 'components')

  const comparisons = componentSlugs.map((slug) => {
    // Presence intentionally has no namespace barrel in either framework.
    if (slug === 'presence') {
      return {
        react: ['Presence'],
        slug,
        solid: componentEntry(slug).Presence ? ['Presence'] : [],
      }
    }

    const indexSource = reactIndexes.get(slug)
    const namespaceSource = reactNamespaces.get(slug)
    if (!indexSource || !namespaceSource)
      throw new Error(`${slug}: missing React index or namespace source`)

    const name = namespaceName(indexSource)
    if (!name)
      throw new Error(`${slug}: cannot resolve React namespace name`)
    const namespace = componentEntry(slug)[name]
    if (!namespace || (typeof namespace !== 'object' && typeof namespace !== 'function'))
      throw new Error(`${slug}: Solid entry does not export namespace ${name}`)

    return {
      react: runtimeExports(namespaceSource),
      slug,
      solid: Object.keys(namespace as ModuleExports).toSorted(),
    }
  })

  const indexComparisons = componentSlugs.map((slug) => {
    const indexSource = reactIndexes.get(slug)
    if (!indexSource)
      throw new Error(`${slug}: missing React index source`)

    return {
      react: runtimeExports(indexSource),
      slug,
      solid: Object.keys(componentEntry(slug)).toSorted(),
    }
  })

  it('keeps every React runtime export available from each component index', () => {
    const missing = indexComparisons.flatMap(({ react, slug, solid }) => {
      const solidSet = new Set(solid)
      return react.filter(name => !solidSet.has(name)).map(name => `${slug}: ${name}`)
    })

    expect(
      missing,
      `Solid component indexes are missing ${missing.length} React runtime export(s):\n${missing.join('\n')}`,
    ).toEqual([])
  })

  it('keeps every React type export available from each component index', () => {
    const missing = componentSlugs.flatMap((slug) => {
      const reactIndex = reactIndexes.get(slug)
      const solidIndex = solidIndexes.get(slug)
      if (!reactIndex || !solidIndex)
        return [`${slug}: missing React or Solid index source`]

      const solidTypes = new Set(typeExports(solidIndex))
      return typeExports(reactIndex)
        .filter(name => !solidTypes.has(name))
        .map(name => `${slug}: ${name}`)
    })

    expect(
      missing,
      `Solid component indexes are missing ${missing.length} React type export(s):\n${missing.join('\n')}`,
    ).toEqual([])
  })

  it('keeps every namespace runtime part identical to React', () => {
    const mismatches = comparisons.flatMap(({ react, slug, solid }) => {
      const reactSet = new Set(react)
      const solidSet = new Set(solid)
      const missing = react.filter(name => !solidSet.has(name))
      const extra = solid.filter(name => !reactSet.has(name))
      return missing.length || extra.length ? [{ extra, missing, slug }] : []
    })

    expect(
      mismatches,
      `Solid namespace parity failed:\n${JSON.stringify(mismatches, null, 2)}`,
    ).toEqual([])
  })

  it('keeps the 468-part public component baseline', () => {
    const reactTotal = comparisons.reduce((total, item) => total + item.react.length, 0)
    const solidTotal = comparisons.reduce((total, item) => total + item.solid.length, 0)

    expect(reactTotal, 'React public component baseline changed').toBe(468)
    expect(solidTotal, 'Solid must expose exactly 468 public component parts').toBe(468)
  })
})

describe('solid package entry resolution', () => {
  const componentSlugs = slugsFromEntries(solidComponentEntries, 'components')
  const providerSlugs = slugsFromEntries(solidProviderEntries, 'providers')
  const subpaths = expandedSubpaths(componentSlugs, providerSlugs)
  const sourceModules: Record<string, ModuleExports> = {
    '../src/index.ts': solidRoot,
    ...infrastructureEntries,
    ...solidComponentEntries,
    ...solidProviderEntries,
  }

  it('build-resolves the root entry and every public source subpath', () => {
    expect(subpaths).toHaveLength(57)

    const failures = subpaths.flatMap(({ source, subpath }) => {
      const sourceKey = `..${source.slice(1)}`
      const module = sourceModules[sourceKey]
      if (!module)
        return [`${subpath}: source target ${source} is missing or cannot be imported`]
      if (Object.keys(module).length === 0)
        return [`${subpath}: source target ${source} has no runtime exports`]
      return []
    })

    expect(failures, failures.join('\n')).toEqual([])
  })

  it('maps every subpath to build output conditions', () => {
    const failures = subpaths.flatMap(({ exportMap, subpath }) => {
      const issues: string[] = []
      if (!exportMap.types.startsWith('./dist/') || !exportMap.types.endsWith('.d.ts'))
        issues.push(`${subpath}: invalid types target ${exportMap.types}`)
      if (!exportMap.solid.startsWith('./dist/') || !exportMap.solid.endsWith('.jsx'))
        issues.push(`${subpath}: invalid solid target ${exportMap.solid}`)
      if (!exportMap.import.startsWith('./dist/') || !exportMap.import.endsWith('.js'))
        issues.push(`${subpath}: invalid import target ${exportMap.import}`)
      if (exportMap.default !== exportMap.import)
        issues.push(`${subpath}: default target must match import target`)
      return issues
    })

    expect(failures, failures.join('\n')).toEqual([])
    expect(packageExports['./package.json']).toBe('./package.json')
  })

  it('re-exports every component and provider subpath from the root entry', () => {
    const missing = [
      ...Object.entries(solidComponentEntries),
      ...Object.entries(solidProviderEntries),
    ].flatMap(([path, module]) => Object.keys(module)
      .filter(name => !(name in solidRoot))
      .map(name => `${path}: ${name}`))

    expect(
      missing,
      `Root entry is missing ${missing.length} subpath export(s):\n${missing.join('\n')}`,
    ).toEqual([])
  })
})
