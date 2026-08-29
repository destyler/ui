import { describe, expect, it } from 'vitest'

const reactComponentExamples = import.meta.glob('../../react/src/components/*/examples/**/*.tsx')
const vueComponentExamples = import.meta.glob('../../vue/src/components/*/examples/**/*.vue')
const svelteComponentExamples = import.meta.glob('../src/lib/components/*/examples/**/*.svelte')

const reactComponentExampleSources = import.meta.glob('../../react/src/components/*/examples/**/*.tsx', {
  eager: true,
  import: 'default',
  query: '?raw',
}) as Record<string, string>
const vueComponentExampleSources = import.meta.glob('../../vue/src/components/*/examples/**/*.vue', {
  eager: true,
  import: 'default',
  query: '?raw',
}) as Record<string, string>
const svelteComponentExampleSources = import.meta.glob('../src/lib/components/*/examples/**/*.svelte', {
  eager: true,
  import: 'default',
  query: '?raw',
}) as Record<string, string>

const reactProviderExamples = import.meta.glob('../../react/src/providers/*/examples/*.tsx')
const vueProviderExamples = import.meta.glob('../../vue/src/providers/*/examples/*.vue')
const svelteProviderExamples = import.meta.glob('../src/lib/providers/*/examples/*.svelte')

const reactComponentTestSources = import.meta.glob('../../react/src/components/*/test/**/*.test.tsx', {
  eager: true,
  import: 'default',
  query: '?raw',
}) as Record<string, string>
const vueComponentTestSources = import.meta.glob('../../vue/src/components/*/test/**/*.test.ts', {
  eager: true,
  import: 'default',
  query: '?raw',
}) as Record<string, string>
const svelteComponentTestSources = import.meta.glob('../src/lib/components/*/test/**/*.test.ts', {
  eager: true,
  import: 'default',
  query: '?raw',
}) as Record<string, string>

const reactProviderTestSources = import.meta.glob('../../react/src/providers/*/test/**/*.test.tsx', {
  eager: true,
  import: 'default',
  query: '?raw',
}) as Record<string, string>
const vueProviderTestSources = import.meta.glob('../../vue/src/providers/*/test/**/*.test.ts', {
  eager: true,
  import: 'default',
  query: '?raw',
}) as Record<string, string>
const svelteProviderTestSources = import.meta.glob('../src/lib/providers/*/test/**/*.test.ts', {
  eager: true,
  import: 'default',
  query: '?raw',
}) as Record<string, string>

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

type Framework = 'react' | 'svelte' | 'vue'
type Section = 'components' | 'providers'

const vueStoryNameAliases: Record<string, Record<string, string>> = {
  'components/breadcrumbs': {
    Basic: 'BasicExample',
    Context: 'ContextExample',
    RootProvider: 'RootProviderExample',
  },
  'components/checkbox': {
    IndeterminateExample: 'Indeterminate',
  },
  'components/menu': {
    CheckboxMenu: 'Checkbox',
    ContextMenu: 'Context',
    ControlledMenu: 'Controlled',
    GroupMenu: 'Group',
    NestedMenu: 'Nested',
    RadioGroupMenu: 'RadioGroup',
    RenderPropMenu: 'RenderProp',
    RootProviderMenu: 'RootProvider',
    SeparatorMenu: 'Separator',
  },
  'components/number-input': {
    FormattedExample: 'Formatted',
    ScrubberExample: 'Scrubber',
  },
  'components/pagination': {
    CustomizedExample: 'Customized',
  },
  'components/popover': {
    Positionning: 'Positioning',
  },
  'components/splitter': {
    Event: 'Events',
  },
  'providers/focus-trap': {
    AutofocusExample: 'Autofocus',
  },
}

const providerStoryLayoutExceptions: Record<string, Record<Framework, string>> = {
  // The existing React baseline is padded while Vue and Svelte are fullscreen.
  // Keeping the mismatch explicit makes any future change require a deliberate review.
  environment: {
    react: 'padded',
    svelte: 'fullscreen',
    vue: 'fullscreen',
  },
}

function exampleMap(paths: string[], section: 'components' | 'providers') {
  const result: Record<string, string[]> = {}
  for (const path of paths) {
    const match = path.match(new RegExp(`/${section}/([^/]+)/examples/(.+)\\.[^/.]+$`))
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
    const match = path.match(new RegExp(`/${section}/([^/]+)/examples/(.+)\\.[^/.]+$`))
    if (match)
      result[`${match[1]}/${match[2]}`] = source
  }
  return result
}

function testedExamples(sources: Record<string, string>, section: Section) {
  const result = new Set<string>()
  for (const [path, source] of Object.entries(sources)) {
    const slug = path.match(new RegExp(`/${section}/([^/]+)/test/`))?.[1]
    if (!slug)
      continue
    for (const match of source.matchAll(/from\s+['"]\.\.\/examples\/([^'"]+)['"]/g)) {
      const example = match[1].replace(/\.(?:svelte|tsx?|vue)$/, '')
      result.add(`${slug}/${example}`)
    }
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

function literalClasses(source: string, framework: Framework) {
  const pattern = framework === 'react'
    ? /className\s*=\s*['"]([^'"]+)['"]/g
    : /\bclass\s*=\s*['"]([^'"]+)['"]/g
  return new Set([...source.matchAll(pattern)].flatMap(match => match[1].split(/\s+/)).filter(Boolean))
}

function hasInlineStyle(source: string, framework: Framework) {
  if (framework === 'react')
    return /\bstyle\s*=\s*\{\{/.test(source)
  if (framework === 'vue')
    return /(?:\bstyle|:style)\s*=/.test(source)
  return /\bstyle(?::[\w-]+)?\s*=/.test(source)
}

function exportedStories(source: string) {
  const names = new Set<string>()
  for (const match of source.matchAll(/export\s+const\s+([A-Za-z_$][\w$]*)/g)) names.add(match[1])
  for (const match of source.matchAll(/export\s+function\s+([A-Za-z_$][\w$]*)/g)) names.add(match[1])
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
  return [...new Set([...source.matchAll(/from\s+['"]\.\.\/examples\/([^'"]+)/g)]
    .map(match => match[1].replace(/\.(?:svelte|tsx?|vue)$/, '')))]
    .sort()
}

function storyLayout(source: string) {
  return source.match(/layout\s*:\s*['"]([^'"]+)/)?.[1] ?? 'padded'
}

function storyMap<T>(
  stories: Record<string, string>,
  section: Section,
  readSource: (source: string, slug: string) => T,
) {
  const result: Record<string, T> = {}
  for (const [path, source] of Object.entries(stories)) {
    const slug = path.match(new RegExp(`/${section}/([^/]+)/stories/`))?.[1]
    if (slug)
      result[slug] = readSource(source, slug)
  }
  return result
}

function exampleImports(source: string) {
  const imports: Record<string, string> = {}

  for (const match of source.matchAll(/import\s+([A-Za-z_$][\w$]*)\s+from\s+['"]\.\.\/examples\/([^'"]+)['"]/g))
    imports[match[1]] = match[2].replace(/\.(?:svelte|tsx?|vue)$/, '')

  for (const match of source.matchAll(/import\s*\{([^}]+)\}\s*from\s*['"]\.\.\/examples\/([^'"]+)['"]/g)) {
    const example = match[2].replace(/\.(?:svelte|tsx?|vue)$/, '')
    for (const specifier of match[1].split(',')) {
      const [imported, local = imported] = specifier.trim().split(/\s+as\s+/)
      if (local)
        imports[local] = example
    }
  }

  return imports
}

function exportedStoryBlocks(source: string) {
  const declarations = [...source.matchAll(/export\s+(const|function)\s+([A-Za-z_$][\w$]*)/g)]
  return declarations.map((declaration, index) => ({
    body: source.slice(declaration.index, declarations[index + 1]?.index ?? source.length),
    name: declaration[2],
  }))
}

function vueStoryComponent(body: string, label: string) {
  const template = body.match(/template\s*:\s*(['"`])([\s\S]*?)\1/)?.[2]
  const registrations = body.match(/components\s*:\s*\{([^}]*)\}/)?.[1]
  if (!template || !registrations)
    return undefined

  const registeredComponents = registrations.split(',').flatMap((specifier) => {
    const [registered, local = registered] = specifier.trim().split(/\s*:\s*/)
    return registered ? [{ local, registered }] : []
  })
  const renderedTags = [...template.matchAll(/<([a-z_$][\w$-]*)\b/gi)].map(match => match[1])
  const normalizeName = (name: string) => name.replaceAll('-', '').toLowerCase()
  const renderedComponents = registeredComponents.filter(({ registered }) =>
    renderedTags.some(tag => normalizeName(tag) === normalizeName(registered)),
  )

  if (renderedComponents.length !== 1)
    throw new Error(`${label}: template must render exactly one registered component`)
  return renderedComponents[0].local
}

function storyBindings(source: string, framework: Framework, label: string) {
  const bindings: Record<string, string> = {}
  const imports = exampleImports(source)

  for (const match of source.matchAll(/export\s*\{([^}]+)\}\s*from\s*['"]\.\.\/examples\/([^'"]+)['"]/g)) {
    const example = match[2].replace(/\.(?:svelte|tsx?|vue)$/, '')
    for (const specifier of match[1].split(',')) {
      const [imported, exported = imported] = specifier.trim().split(/\s+as\s+/)
      if (exported)
        bindings[exported] = example
    }
  }

  for (const { body, name } of exportedStoryBlocks(source)) {
    if (bindings[name])
      continue

    const component = framework === 'react'
      ? body.match(/render\s*:\s*\(\)\s*=>\s*<([A-Za-z_$][\w$]*)\b/)?.[1]
      : framework === 'vue'
        ? vueStoryComponent(body, `${label}/${name}`)
        : body.match(/\bstory\s*\(\s*([A-Za-z_$][\w$]*)/)?.[1]
          ?? body.match(/Component\s*:\s*([A-Za-z_$][\w$]*)/)?.[1]
    const example = component && imports[component]
    if (!example)
      throw new Error(`${label}: cannot resolve Story ${name} to an imported example`)
    bindings[name] = example
  }

  const exports = exportedStories(source)
  const boundStories = Object.keys(bindings).sort()
  if (JSON.stringify(boundStories) !== JSON.stringify(exports))
    throw new Error(`${label}: not every Story export resolves to an example`)

  const references = referencedExamples(source)
  const boundExamples = [...new Set(Object.values(bindings))].sort()
  if (JSON.stringify(boundExamples) !== JSON.stringify(references))
    throw new Error(`${label}: not every referenced example is rendered by a Story export`)

  return bindings
}

function pascalCaseStoryName(name: string) {
  return `${name.charAt(0).toUpperCase()}${name.slice(1)}`
}

function canonicalVueStoryName(section: Section, slug: string, name: string) {
  const pascalName = pascalCaseStoryName(name)
  return vueStoryNameAliases[`${section}/${slug}`]?.[pascalName] ?? pascalName
}

function canonicalVueStoryNames(source: string, section: Section, slug: string) {
  return exportedStories(source)
    .map(name => canonicalVueStoryName(section, slug, name))
    .sort()
}

function canonicalVueStoryBindings(source: string, section: Section, slug: string) {
  const bindings = storyBindings(source, 'vue', `vue/${section}/${slug}`)
  return Object.fromEntries(Object.entries(bindings).map(([name, example]) => [
    canonicalVueStoryName(section, slug, name),
    example,
  ]))
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
    expect(react.progress).toContain('circular/Basic')
    expect(react.progress).toContain('linear/ValueText')
    expect(vue).toEqual(react)
    expect(svelte).toEqual(react)
  })

  it.each([
    {
      react: reactComponentTestSources,
      section: 'components' as const,
      svelte: svelteComponentTestSources,
      vue: vueComponentTestSources,
    },
    {
      react: reactProviderTestSources,
      section: 'providers' as const,
      svelte: svelteProviderTestSources,
      vue: vueProviderTestSources,
    },
  ])('tests every $section example covered by both React and Vue', ({ react, section, svelte, vue }) => {
    const reactExamples = testedExamples(react, section)
    const vueExamples = testedExamples(vue, section)
    const svelteExamples = testedExamples(svelte, section)
    const sharedBaseline = [...reactExamples]
      .filter(example => vueExamples.has(example))
      .sort()

    expect(sharedBaseline.length, `${section} shared behavior baseline`).toBeGreaterThan(0)
    expect(
      sharedBaseline.filter(example => !svelteExamples.has(example)),
      `${section} examples missing Svelte behavior coverage`,
    ).toEqual([])
  })

  it('keeps non-Basic examples self-contained', () => {
    const importsBasic = Object.entries(svelteComponentExampleSources)
      .filter(([path]) => !path.endsWith('/Basic.svelte'))
      .filter(([, source]) => /from\s+['"]\.\/Basic\.svelte['"]/.test(source))
      .map(([path]) => path)

    expect(importsBasic).toEqual([])
  })

  it('keeps every component Story export aligned', () => {
    const react = storyMap(reactComponentStories, 'components', exportedStories)
    const vue = storyMap(
      vueComponentStories,
      'components',
      (source, slug) => canonicalVueStoryNames(source, 'components', slug),
    )
    const svelte = storyMap(svelteComponentStories, 'components', exportedStories)
    expect(vue).toEqual(react)
    expect(svelte).toEqual(react)
  })

  it('resolves the component rendered by a Vue Story template', () => {
    expect(vueStoryComponent(`components: { Basic }, template: '<Basic />'`, 'fixture')).toBe('Basic')
    expect(() => vueStoryComponent(
      `components: { Basic }, template: '<Other />'`,
      'fixture',
    )).toThrow('fixture: template must render exactly one registered component')
  })

  it('keeps Vue Story name exceptions explicit and current', () => {
    const react = {
      components: storyMap(reactComponentStories, 'components', exportedStories),
      providers: storyMap(reactProviderStories, 'providers', exportedStories),
    }
    const vue = {
      components: storyMap(vueComponentStories, 'components', exportedStories),
      providers: storyMap(vueProviderStories, 'providers', exportedStories),
    }

    for (const [key, aliases] of Object.entries(vueStoryNameAliases)) {
      const [section, slug] = key.split('/') as [Section, string]
      const vueStories = vue[section][slug].map(pascalCaseStoryName)
      const reactStories = react[section][slug]
      for (const [vueStory, reactStory] of Object.entries(aliases)) {
        expect(vueStory, `${key}: stale Vue alias`).not.toBe(reactStory)
        expect(vueStories, `${key}: ${vueStory}`).toContain(vueStory)
        expect(reactStories, `${key}: ${reactStory}`).toContain(reactStory)
      }
    }
  })

  it('binds every component Story export to the same example', () => {
    const react = storyMap(
      reactComponentStories,
      'components',
      (source, slug) => storyBindings(source, 'react', `react/components/${slug}`),
    )
    const vue = storyMap(
      vueComponentStories,
      'components',
      (source, slug) => canonicalVueStoryBindings(source, 'components', slug),
    )
    const svelte = storyMap(
      svelteComponentStories,
      'components',
      (source, slug) => storyBindings(source, 'svelte', `svelte/components/${slug}`),
    )
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

  it('keeps shared provider Story exports aligned', () => {
    const react = storyMap(reactProviderStories, 'providers', exportedStories)
    const vue = storyMap(
      vueProviderStories,
      'providers',
      (source, slug) => canonicalVueStoryNames(source, 'providers', slug),
    )
    const svelte = storyMap(svelteProviderStories, 'providers', exportedStories)
    for (const [provider, stories] of Object.entries(react)) {
      expect(vue[provider], provider).toEqual(stories)
      expect(svelte[provider], provider).toEqual(stories)
    }
  })

  it('binds every shared provider Story export to the same example', () => {
    const react = storyMap(
      reactProviderStories,
      'providers',
      (source, slug) => storyBindings(source, 'react', `react/providers/${slug}`),
    )
    const vue = storyMap(
      vueProviderStories,
      'providers',
      (source, slug) => canonicalVueStoryBindings(source, 'providers', slug),
    )
    const svelte = storyMap(
      svelteProviderStories,
      'providers',
      (source, slug) => storyBindings(source, 'svelte', `svelte/providers/${slug}`),
    )
    for (const [provider, bindings] of Object.entries(react)) {
      expect(vue[provider], provider).toEqual(bindings)
      expect(svelte[provider], provider).toEqual(bindings)
    }
  })

  it('keeps shared provider Story layouts aligned', () => {
    const react = storyMap(reactProviderStories, 'providers', storyLayout)
    const vue = storyMap(vueProviderStories, 'providers', storyLayout)
    const svelte = storyMap(svelteProviderStories, 'providers', storyLayout)
    const sharedProviders = new Set(Object.keys(react))
    const staleExceptions = Object.keys(providerStoryLayoutExceptions)
      .filter(provider => !sharedProviders.has(provider))
    expect(staleExceptions, 'stale provider layout exceptions').toEqual([])

    for (const [provider, reactLayout] of Object.entries(react)) {
      const exception = providerStoryLayoutExceptions[provider]
      if (exception) {
        expect({
          react: reactLayout,
          svelte: svelte[provider],
          vue: vue[provider],
        }, provider).toEqual(exception)
        continue
      }
      expect(vue[provider], provider).toBe(reactLayout)
      expect(svelte[provider], provider).toBe(reactLayout)
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
