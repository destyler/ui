import { describe, expect, it } from 'vitest'

const reactComponentExamples = import.meta.glob('../../react/src/components/*/examples/*.tsx')
const vueComponentExamples = import.meta.glob('../../vue/src/components/*/examples/*.vue')
const svelteComponentExamples = import.meta.glob('../src/lib/components/*/examples/*.svelte')

const reactComponentExampleSources = import.meta.glob('../../react/src/components/*/examples/*.tsx', {
  eager: true,
  import: 'default',
  query: '?raw',
}) as Record<string, string>
const vueComponentExampleSources = import.meta.glob('../../vue/src/components/*/examples/*.vue', {
  eager: true,
  import: 'default',
  query: '?raw',
}) as Record<string, string>
const svelteComponentExampleSources = import.meta.glob('../src/lib/components/*/examples/*.svelte', {
  eager: true,
  import: 'default',
  query: '?raw',
}) as Record<string, string>

const reactProviderExamples = import.meta.glob('../../react/src/providers/*/examples/*.tsx')
const vueProviderExamples = import.meta.glob('../../vue/src/providers/*/examples/*.vue')
const svelteProviderExamples = import.meta.glob('../src/lib/providers/*/examples/*.svelte')

const reactComponentStories = import.meta.glob('../../react/src/components/*/stories/*.stories.tsx', {
  eager: true,
  import: 'default',
  query: '?raw',
}) as Record<string, string>
const vueComponentStories = import.meta.glob('../../vue/src/components/*/stories/*.stories.ts', {
  eager: true,
  import: 'default',
  query: '?raw',
}) as Record<string, string>
const svelteComponentStories = import.meta.glob('../src/lib/components/*/stories/*.stories.ts', {
  eager: true,
  import: 'default',
  query: '?raw',
}) as Record<string, string>

const reactProviderStories = import.meta.glob('../../react/src/providers/*/stories/*.stories.{ts,tsx}', {
  eager: true,
  import: 'default',
  query: '?raw',
}) as Record<string, string>
const vueProviderStories = import.meta.glob('../../vue/src/providers/*/stories/*.stories.ts', {
  eager: true,
  import: 'default',
  query: '?raw',
}) as Record<string, string>
const svelteProviderStories = import.meta.glob('../src/lib/providers/*/stories/*.stories.ts', {
  eager: true,
  import: 'default',
  query: '?raw',
}) as Record<string, string>

const reactNamespaceSources = import.meta.glob('../../react/src/components/*/namespace.ts', {
  eager: true,
  import: 'default',
  query: '?raw',
}) as Record<string, string>
const vueNamespaceSources = import.meta.glob('../../vue/src/components/*/namespace.ts', {
  eager: true,
  import: 'default',
  query: '?raw',
}) as Record<string, string>
const svelteNamespaceSources = import.meta.glob('../src/lib/components/*/namespace.ts', {
  eager: true,
  import: 'default',
  query: '?raw',
}) as Record<string, string>

const storybookPreviews = import.meta.glob([
  '../../react/.storybook/preview.ts',
  '../../vue/.storybook/preview.ts',
  '../.storybook/preview.ts',
], {
  eager: true,
  import: 'default',
  query: '?raw',
}) as Record<string, string>

const sharedBootstrap = import.meta.glob('../../../utils/bootstrap.css', {
  eager: true,
  import: 'default',
  query: '?raw',
}) as Record<string, string>
const sharedComponentStyles = import.meta.glob('../../../utils/style/*.css', {
  eager: true,
  import: 'default',
  query: '?raw',
}) as Record<string, string>

function exampleMap(paths: string[], section: 'components' | 'providers') {
  const result: Record<string, string[]> = {}
  for (const path of paths) {
    const match = path.match(new RegExp(`/${section}/([^/]+)/examples/([^/.]+)\\.`))
    if (!match)
      continue
    const [, slug, example] = match
    result[slug] ??= []
    result[slug].push(example)
  }
  for (const examples of Object.values(result)) examples.sort()
  return result
}

function exampleSourceMap(sources: Record<string, string>, section: 'components' | 'providers') {
  const result: Record<string, string> = {}
  for (const [path, source] of Object.entries(sources)) {
    const match = path.match(new RegExp(`/${section}/([^/]+)/examples/([^/.]+)\.`))
    if (match)
      result[`${match[1]}/${match[2]}`] = source
  }
  return result
}

function getComponentExampleSource(sources: Record<string, string>, slug: string, example: string) {
  const entry = Object.entries(sources).find(([path]) => path.includes(`/components/${slug}/examples/${example}.`))
  if (!entry)
    throw new Error(`Missing ${slug}/${example} example source`)
  return entry[1]
}

function componentTagCounts(source: string) {
  const counts: Record<string, number> = {}
  for (const match of source.matchAll(/<([A-Z][A-Za-z0-9]*\.[A-Z][A-Za-z0-9]*)\b/g))
    counts[match[1]] = (counts[match[1]] ?? 0) + 1
  return counts
}

function literalClasses(source: string, framework: 'react' | 'svelte' | 'vue') {
  const pattern = framework === 'react'
    ? /className\s*=\s*['"]([^'"]+)['"]/g
    : /\bclass\s*=\s*['"]([^'"]+)['"]/g
  return new Set([...source.matchAll(pattern)].flatMap(match => match[1].split(/\s+/)).filter(Boolean))
}

function hasInlineStyle(source: string, framework: 'react' | 'svelte' | 'vue') {
  if (framework === 'react')
    return /\bstyle\s*=\s*\{\{/.test(source)
  if (framework === 'vue')
    return /(?:\bstyle|:style)\s*=/.test(source)
  return /\bstyle(?::[\w-]+)?\s*=/.test(source)
}

function exportedStories(source: string) {
  const names = new Set<string>()
  for (const match of source.matchAll(/export\s+const\s+([A-Za-z_$][\w$]*)/g)) names.add(match[1])
  for (const match of source.matchAll(/export\s*\{([^}]+)\}\s*from/g)) {
    for (const specifier of match[1].split(',')) {
      const parts = specifier.trim().split(/\s+as\s+/)
      if (parts[0])
        names.add(parts.at(-1)!)
    }
  }
  return [...names].sort()
}

function referencedExamples(source: string) {
  return [...source.matchAll(/from\s+['"]\.\.\/examples\/([^.'"]+)/g)]
    .map(match => match[1])
    .sort()
}

function storyLayout(source: string) {
  return [source.match(/layout\s*:\s*['"]([^'"]+)/)?.[1] ?? 'padded']
}

function storyMap(
  stories: Record<string, string>,
  section: 'components' | 'providers',
  readSource: (source: string) => string[],
) {
  const result: Record<string, string[]> = {}
  for (const [path, source] of Object.entries(stories)) {
    const slug = path.match(new RegExp(`/${section}/([^/]+)/stories/`))?.[1]
    if (slug)
      result[slug] = readSource(source)
  }
  return result
}

function destylerTypeExports(source: string) {
  const names = new Set<string>()
  for (const match of source.matchAll(/export type\s*\{([\s\S]*?)\}\s*from\s*['"]@destyler\/[^'"]+['"]/g)) {
    for (const specifier of match[1].split(',')) {
      const exportedName = specifier.trim().split(/\s+as\s+/).at(-1)
      if (exportedName)
        names.add(exportedName)
    }
  }
  return names
}

function namespaceComponentExports(source: string) {
  const names = new Set<string>()
  for (const match of source.matchAll(/export\s*\{([\s\S]*?)\}\s*from\s*['"]\.\/components\/[^'"]+['"]/g)) {
    for (const specifier of match[1].split(',')) {
      const value = specifier.trim()
      if (!value || value.startsWith('type '))
        continue
      names.add(value.split(/\s+as\s+/).at(-1)!)
    }
  }
  return names
}

function sourceBySlug(sources: Record<string, string>) {
  const result: Record<string, string> = {}
  for (const [file, source] of Object.entries(sources)) {
    const slug = file.match(/\/components\/([^/]+)\/namespace\.ts$/)?.[1]
    if (slug)
      result[slug] = source
  }
  return result
}

describe('react, Vue, and Svelte example parity', () => {
  it('exports shared components from every namespace', () => {
    const react = sourceBySlug(reactNamespaceSources)
    const vue = sourceBySlug(vueNamespaceSources)
    const svelte = sourceBySlug(svelteNamespaceSources)

    for (const [slug, reactSource] of Object.entries(react)) {
      if (!vue[slug] || !svelte[slug])
        continue
      const reactComponents = namespaceComponentExports(reactSource)
      const vueComponents = namespaceComponentExports(vue[slug])
      const svelteComponents = namespaceComponentExports(svelte[slug])
      const sharedComponents = [...reactComponents].filter(component => vueComponents.has(component))

      for (const component of sharedComponents)
        expect(svelteComponents.has(component), `${slug}: ${component}`).toBe(true)
    }
  })

  it('exports shared machine types from every component namespace', () => {
    const react = sourceBySlug(reactNamespaceSources)
    const vue = sourceBySlug(vueNamespaceSources)
    const svelte = sourceBySlug(svelteNamespaceSources)

    for (const [slug, reactSource] of Object.entries(react)) {
      if (!vue[slug] || !svelte[slug])
        continue
      const reactTypes = destylerTypeExports(reactSource)
      const vueTypes = destylerTypeExports(vue[slug])
      const svelteTypes = destylerTypeExports(svelte[slug])
      const sharedTypes = [...reactTypes].filter(typeName => vueTypes.has(typeName))

      for (const typeName of sharedTypes)
        expect(svelteTypes.has(typeName), `${slug}: ${typeName}`).toBe(true)
    }
  })

  it('keeps the Tabs InitialTab example uncontrolled', () => {
    const source = getComponentExampleSource(svelteComponentExampleSources, 'tabs', 'InitialTab')
    expect(source).toContain('<Tabs.Root defaultValue="react">')
    expect(source).not.toMatch(/\bbind:value\b/)
    expect(source).not.toContain('$state(')
  })

  it.each([
    ['CustomDelay', 'openDelay={500} closeDelay={600}'],
    ['DisableClick', 'disableClickTrigger'],
    ['DisableHover', 'disableHoverTrigger'],
    ['Vertical', 'orientation="vertical"'],
  ])('keeps NavigationMenu %s structurally aligned across frameworks', (example, rootProps) => {
    const react = getComponentExampleSource(reactComponentExampleSources, 'navigation-menu', example)
    const vue = getComponentExampleSource(vueComponentExampleSources, 'navigation-menu', example)
    const svelte = getComponentExampleSource(svelteComponentExampleSources, 'navigation-menu', example)

    expect(componentTagCounts(vue)).toEqual(componentTagCounts(react))
    expect(componentTagCounts(svelte)).toEqual(componentTagCounts(react))
    expect(svelte).toContain(`<NavigationMenu.Root ${rootProps}>`)
    expect(svelte).not.toContain('from \'./Basic.svelte\'')
  })

  it('keeps the standalone Calendar free of popup content structure', () => {
    const react = getComponentExampleSource(reactComponentExampleSources, 'calendar', 'Standalone')
    const vue = getComponentExampleSource(vueComponentExampleSources, 'calendar', 'Standalone')
    const svelte = getComponentExampleSource(svelteComponentExampleSources, 'calendar', 'Standalone')

    expect(componentTagCounts(vue)).toEqual(componentTagCounts(react))
    expect(componentTagCounts(svelte)).toEqual(componentTagCounts(react))
    expect(svelte).not.toContain('<Calendar.Content')
  })

  it('keeps every component example name identical', () => {
    const react = exampleMap(Object.keys(reactComponentExamples), 'components')
    const vue = exampleMap(Object.keys(vueComponentExamples), 'components')
    const svelte = exampleMap(Object.keys(svelteComponentExamples), 'components')
    expect(vue).toEqual(react)
    expect(svelte).toEqual(react)
  })

  it('keeps non-Basic examples self-contained', () => {
    const importsBasic = Object.entries(svelteComponentExampleSources)
      .filter(([path]) => !path.endsWith('/Basic.svelte'))
      .filter(([, source]) => /from\s+['"]\.\/Basic\.svelte['"]/.test(source))
      .map(([path]) => path)

    expect(importsBasic).toEqual([])
  })

  it('keeps every component Story export identical', () => {
    const react = storyMap(reactComponentStories, 'components', exportedStories)
    const svelte = storyMap(svelteComponentStories, 'components', exportedStories)
    expect(svelte).toEqual(react)
  })

  it('renders the same component examples in every Storybook', () => {
    const react = storyMap(reactComponentStories, 'components', referencedExamples)
    const vue = storyMap(vueComponentStories, 'components', referencedExamples)
    const svelte = storyMap(svelteComponentStories, 'components', referencedExamples)
    expect(vue).toEqual(react)
    expect(svelte).toEqual(react)
  })

  it('keeps every component Story layout identical', () => {
    const react = storyMap(reactComponentStories, 'components', storyLayout)
    const vue = storyMap(vueComponentStories, 'components', storyLayout)
    const svelte = storyMap(svelteComponentStories, 'components', storyLayout)
    expect(vue).toEqual(react)
    expect(svelte).toEqual(react)
  })

  it('keeps shared literal classes in every component example', () => {
    const react = exampleSourceMap(reactComponentExampleSources, 'components')
    const vue = exampleSourceMap(vueComponentExampleSources, 'components')
    const svelte = exampleSourceMap(svelteComponentExampleSources, 'components')
    for (const [example, reactSource] of Object.entries(react)) {
      const reactClasses = literalClasses(reactSource, 'react')
      const vueClasses = literalClasses(vue[example], 'vue')
      const sharedClasses = new Set([...reactClasses].filter(className => vueClasses.has(className)))
      const svelteClasses = literalClasses(svelte[example], 'svelte')
      for (const className of sharedClasses)
        expect(svelteClasses.has(className), `${example}: ${className}`).toBe(true)

      const knownClasses = new Set([...reactClasses, ...vueClasses])
      for (const className of svelteClasses)
        expect(knownClasses.has(className), `${example}: unexpected ${className}`).toBe(true)
    }
  })

  it('keeps shared inline styling in every component example', () => {
    const react = exampleSourceMap(reactComponentExampleSources, 'components')
    const vue = exampleSourceMap(vueComponentExampleSources, 'components')
    const svelte = exampleSourceMap(svelteComponentExampleSources, 'components')
    for (const [example, reactSource] of Object.entries(react)) {
      const reactHasStyle = hasInlineStyle(reactSource, 'react')
      const vueHasStyle = hasInlineStyle(vue[example], 'vue')
      if (reactHasStyle === vueHasStyle)
        expect(hasInlineStyle(svelte[example], 'svelte'), example).toBe(reactHasStyle)
    }
  })

  it('keeps shared SVG artwork in every component example', () => {
    const react = exampleSourceMap(reactComponentExampleSources, 'components')
    const vue = exampleSourceMap(vueComponentExampleSources, 'components')
    const svelte = exampleSourceMap(svelteComponentExampleSources, 'components')
    for (const [example, reactSource] of Object.entries(react)) {
      const reactCount = reactSource.match(/<svg\b/g)?.length ?? 0
      const vueCount = vue[example].match(/<svg\b/g)?.length ?? 0
      const svelteCount = svelte[example].match(/<svg\b/g)?.length ?? 0
      expect([reactCount, vueCount], example).toContain(svelteCount)
    }
  })

  it('keeps shared provider example names identical', () => {
    const react = exampleMap(Object.keys(reactProviderExamples), 'providers')
    const vue = exampleMap(Object.keys(vueProviderExamples), 'providers')
    const svelte = exampleMap(Object.keys(svelteProviderExamples), 'providers')
    expect(vue).toEqual(react)
    for (const [provider, examples] of Object.entries(react))
      expect(svelte[provider], provider).toEqual(examples)
  })

  it('keeps shared provider Story exports identical', () => {
    const react = storyMap(reactProviderStories, 'providers', exportedStories)
    const svelte = storyMap(svelteProviderStories, 'providers', exportedStories)
    for (const [provider, stories] of Object.entries(react))
      expect(svelte[provider], provider).toEqual(stories)
  })

  it('renders the same shared provider examples in every Storybook', () => {
    const react = storyMap(reactProviderStories, 'providers', referencedExamples)
    const vue = storyMap(vueProviderStories, 'providers', referencedExamples)
    const svelte = storyMap(svelteProviderStories, 'providers', referencedExamples)
    for (const [provider, examples] of Object.entries(react)) {
      expect(vue[provider], provider).toEqual(examples)
      expect(svelte[provider], provider).toEqual(examples)
    }
  })

  it('uses the same shared stylesheet and visual Storybook defaults', () => {
    expect(Object.values(storybookPreviews)).toHaveLength(3)
    for (const preview of Object.values(storybookPreviews)) {
      expect(preview).toContain('import \'../../../utils/bootstrap.css\'')
      expect(preview).toMatch(/color:\s*\/\(background\|color\)\$\/i/)
      expect(preview).toMatch(/date:\s*\/Date\$\/i/)
      expect(preview).toMatch(/codePanel:\s*true/)
      expect(preview).toMatch(/test:\s*'todo'/)
    }
  })

  it('loads every non-empty shared component stylesheet', () => {
    const bootstrap = Object.values(sharedBootstrap)[0]
    const imported = [...bootstrap.matchAll(/@import url\(['"]\.\/style\/([^'"]+)/g)]
      .map(match => match[1])
      .sort()
    const nonEmptyStyles = Object.entries(sharedComponentStyles)
      .filter(([, source]) => source.trim().length > 0)
      .map(([path]) => path.split('/').at(-1)!)
      .sort()
    expect(imported).toEqual(nonEmptyStyles)
  })
})
