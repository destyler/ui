import { describe, expect, it } from 'vitest'
import packageManifestJson from '../package-manifest.json'

interface ComponentManifestEntry {
  anatomy: string | null
  anatomyExceptions?: string[]
  category: string
  name: string
  namespace: string
  namespaceBarrel?: boolean
  slug: string
}

interface ProviderManifestEntry {
  category: string
  name: string
  slug: string
}

const examples = import.meta.glob('../src/lib/components/*/examples/Basic.svelte')
const componentIndexes = import.meta.glob('../src/lib/components/*/index.ts')
const componentIndexSources = import.meta.glob('../src/lib/components/*/index.ts', {
  eager: true,
  import: 'default',
  query: '?raw',
}) as Record<string, string>
const componentNamespaceSources = import.meta.glob('../src/lib/components/*/namespace.ts', {
  eager: true,
  import: 'default',
  query: '?raw',
}) as Record<string, string>
const componentRootFiles = import.meta.glob('../src/lib/components/*/*')
const componentImplementationFiles = import.meta.glob('../src/lib/components/*/components/*')
const componentHooks = import.meta.glob('../src/lib/components/*/hooks/*')
const allComponentSvelteFiles = import.meta.glob('../src/lib/components/**/*.svelte')
const allComponentSvelteSources = import.meta.glob('../src/lib/components/**/*.svelte', {
  eager: true,
  import: 'default',
  query: '?raw',
}) as Record<string, string>
const allComponentTypeScriptSources = import.meta.glob('../src/lib/components/**/*.ts', {
  eager: true,
  import: 'default',
  query: '?raw',
}) as Record<string, string>
const allComponentRuneModules = import.meta.glob('../src/lib/components/**/*.svelte.ts')
const stories = import.meta.glob('../src/lib/components/*/stories/*.stories.ts', {
  eager: true,
  import: 'default',
  query: '?raw',
}) as Record<string, string>
const tests = import.meta.glob('../src/lib/components/*/test/*.test.ts')
const providerExamples = import.meta.glob('../src/lib/providers/*/examples/*.svelte')
const providerIndexes = import.meta.glob('../src/lib/providers/*/index.ts')
const providerRootFiles = import.meta.glob('../src/lib/providers/*/*')
const providerImplementationFiles = import.meta.glob('../src/lib/providers/*/components/*')
const providerHooks = import.meta.glob('../src/lib/providers/*/hooks/*')
const allProviderSvelteFiles = import.meta.glob('../src/lib/providers/**/*.svelte')
const allProviderRuneModules = import.meta.glob('../src/lib/providers/**/*.svelte.ts')
const providerStories = import.meta.glob('../src/lib/providers/*/stories/*.stories.ts', {
  eager: true,
  import: 'default',
  query: '?raw',
}) as Record<string, string>
const providerTests = import.meta.glob('../src/lib/providers/*/test/*.test.ts')

const entries = packageManifestJson.components as ComponentManifestEntry[]
const providerEntries = packageManifestJson.providers as ProviderManifestEntry[]
const infrastructureDirectories = new Set(['collection', 'factory'])

function slugsFromPaths(paths: string[]) {
  return paths.map(path => path.split('/').at(-2)!).sort()
}

function filesForSlug(paths: string[], slug: string, section: 'components' | 'providers' = 'components') {
  return paths
    .filter(path => path.includes(`/${section}/${slug}/`))
    .map(path => path.split('/').at(-1)!)
    .sort()
}

describe('svelte component directory convention', () => {
  it('classifies every component exactly once', () => {
    const classifiedSlugs = entries.map(entry => entry.slug)
    const componentSlugs = slugsFromPaths(Object.keys(componentIndexes))
      .filter(slug => !infrastructureDirectories.has(slug))

    expect(classifiedSlugs.length).toBeGreaterThan(0)
    expect(new Set(classifiedSlugs).size).toBe(classifiedSlugs.length)
    expect(classifiedSlugs.toSorted()).toEqual(componentSlugs)
  })

  it('keeps implementation components inside components directories', () => {
    const misplacedImplementations = Object.keys(allComponentSvelteFiles)
      .filter(path => !path.includes('/examples/'))
      .filter(path => !path.includes('/test/'))
      .filter(path => !/\/components\/[^/]+\/components\//.test(path))

    expect(misplacedImplementations).toEqual([])
    expect(Object.keys(allComponentRuneModules).every(path => path.includes('/hooks/'))).toBe(true)
  })

  it('uses component entry points across component boundaries', () => {
    const sourceFiles = { ...allComponentSvelteSources, ...allComponentTypeScriptSources }
    const privateImportPatterns = [
      /\bfrom\s+['"]\.\.\/\.\.\/([^/'"]+)\/(?:components|hooks)\//g,
      /\bfrom\s+['"]\$lib\/components\/([^/'"]+)\/(?:components|hooks)\//g,
    ]
    const offenders: string[] = []

    for (const [file, source] of Object.entries(sourceFiles)) {
      const owner = file.match(/\/components\/([^/]+)\//)?.[1]
      if (!owner)
        continue

      for (const pattern of privateImportPatterns) {
        for (const match of source.matchAll(pattern)) {
          if (match[1] !== owner)
            offenders.push(file)
        }
      }
    }

    expect([...new Set(offenders)].sort()).toEqual([])
  })

  it('routes component contexts through the shared context helper', () => {
    const sourceFiles = { ...allComponentSvelteSources, ...allComponentTypeScriptSources }
    const directContextImports = Object.entries(sourceFiles)
      .filter(([, source]) => /import\s*\{[^}]*\b(?:getContext|hasContext|setContext)\b[^}]*\}\s*from\s*['"]svelte['"]/.test(source))
      .map(([file]) => file)
      .sort()

    expect(directContextImports).toEqual([])
  })

  it('keeps component infrastructure in the same layout', () => {
    expect(filesForSlug(Object.keys(componentRootFiles), 'collection')).toEqual([
      'index.ts',
      'list-collection.ts',
      'tree-collection.ts',
    ])
    expect(filesForSlug(Object.keys(componentHooks), 'collection')).toEqual([
      'use-list-collection.svelte.ts',
    ])
    expect(filesForSlug(Object.keys(componentRootFiles), 'factory')).toEqual(['index.ts'])
    expect(filesForSlug(Object.keys(componentImplementationFiles), 'factory')).toEqual([
      'SvgFactory.svelte',
      'UI.svelte',
    ])
  })

  it('gives component base props precedence over native HTML props', () => {
    const legacyIntersections = Object.entries(allComponentSvelteSources)
      .filter(([, source]) => /export interface \w+Props extends HTMLProps<[^>]+>, \w+BaseProps/.test(source))
      .map(([file]) => file)

    expect(legacyIntersections).toEqual([])
  })

  it.each(entries)('$name exports every declared BaseProps type', ({ namespaceBarrel, slug }) => {
    const componentSources = Object.entries(allComponentSvelteSources)
      .filter(([file]) => file.includes(`/components/${slug}/components/`))
      .map(([, source]) => source)
    const baseProps = componentSources.flatMap(source =>
      [...source.matchAll(/export interface (\w+BaseProps)\b/g)].map(match => match[1]),
    )
    const indexSource = Object.entries(componentIndexSources)
      .find(([file]) => file.endsWith(`/components/${slug}/index.ts`))?.[1] ?? ''
    const namespaceSource = Object.entries(componentNamespaceSources)
      .find(([file]) => file.endsWith(`/components/${slug}/namespace.ts`))?.[1] ?? ''

    for (const typeName of baseProps) {
      expect(indexSource, `${slug}/index.ts: ${typeName}`).toContain(typeName)
      if (namespaceBarrel !== false)
        expect(namespaceSource, `${slug}/namespace.ts: ${typeName}`).toContain(typeName)
    }
  })

  it.each(entries)('$name exposes namespace component types from its entry point', ({ namespaceBarrel, slug }) => {
    if (namespaceBarrel === false)
      return

    const indexSource = Object.entries(componentIndexSources)
      .find(([file]) => file.endsWith(`/components/${slug}/index.ts`))?.[1] ?? ''
    const namespaceSource = Object.entries(componentNamespaceSources)
      .find(([file]) => file.endsWith(`/components/${slug}/namespace.ts`))?.[1] ?? ''
    const componentTypes = [...namespaceSource.matchAll(
      /export\s*\{([\s\S]*?)\}\s*from\s*['"]\.\/components\/[^'"]+['"]/g,
    )].flatMap(match => [...match[1].matchAll(/type\s+(\w+)/g)].map(typeMatch => typeMatch[1]))

    for (const typeName of componentTypes)
      expect(indexSource, `${slug}/index.ts: ${typeName}`).toContain(typeName)
  })

  it.each(entries)('$name has an example, story, test, and category', ({ category, name, slug }) => {
    const examplePath = Object.keys(examples).find(path => path.endsWith(`/${slug}/examples/Basic.svelte`))
    const storyPath = Object.keys(stories).find(path => path.endsWith(`/${slug}/stories/${slug}.stories.ts`))
    const testPath = Object.keys(tests).find(path => path.endsWith(`/${slug}/test/${slug}.test.ts`))

    expect(examplePath, `${slug} example`).toBeDefined()
    expect(storyPath, `${slug} story`).toBeDefined()
    expect(testPath, `${slug} test`).toBeDefined()
    expect(stories[storyPath!]).toContain(`title: 'Components / ${category} / ${name}'`)
  })

  it.each(entries)('$name follows the component directory layout', ({ anatomy, namespaceBarrel, slug }) => {
    const rootFiles = filesForSlug(Object.keys(componentRootFiles), slug)
    const implementationFiles = filesForSlug(Object.keys(componentImplementationFiles), slug)
    const hookFiles = filesForSlug(Object.keys(componentHooks), slug)
    const expectedRootFiles = [
      ...(anatomy === null ? [] : ['anatomy.ts']),
      'index.ts',
      ...(namespaceBarrel === false ? [] : ['namespace.ts']),
    ].sort()

    expect(rootFiles).toEqual(expectedRootFiles)
    expect(implementationFiles.length, `${slug} components`).toBeGreaterThan(0)
    expect(implementationFiles.every(file => /^[A-Z][A-Za-z0-9]*\.svelte$/.test(file))).toBe(true)
    expect(hookFiles.every(file => file.endsWith('.ts'))).toBe(true)
  })
})

describe('svelte provider directory convention', () => {
  it('classifies every provider exactly once', () => {
    const classifiedSlugs = providerEntries.map(entry => entry.slug)
    const providerSlugs = slugsFromPaths(Object.keys(providerIndexes))

    expect(classifiedSlugs.length).toBeGreaterThan(0)
    expect(new Set(classifiedSlugs).size).toBe(classifiedSlugs.length)
    expect(classifiedSlugs.toSorted()).toEqual(providerSlugs)
  })

  it('keeps provider implementations and hooks in their dedicated directories', () => {
    const misplacedImplementations = Object.keys(allProviderSvelteFiles)
      .filter(path => !path.includes('/examples/'))
      .filter(path => !path.includes('/test/'))
      .filter(path => !/\/providers\/[^/]+\/components\//.test(path))

    expect(misplacedImplementations).toEqual([])
    expect(Object.keys(allProviderRuneModules).every(path => path.includes('/hooks/'))).toBe(true)
  })

  it.each(providerEntries)('$name follows the provider directory layout', ({ slug }) => {
    const rootFiles = filesForSlug(Object.keys(providerRootFiles), slug, 'providers')
    const implementationFiles = filesForSlug(Object.keys(providerImplementationFiles), slug, 'providers')
    const hookFiles = filesForSlug(Object.keys(providerHooks), slug, 'providers')

    expect(rootFiles).toContain('index.ts')
    expect(rootFiles.every(file => ['index.ts', 'namespace.ts'].includes(file))).toBe(true)
    expect(implementationFiles.length, `${slug} components`).toBeGreaterThan(0)
    expect(implementationFiles.every(file => /^[A-Z][A-Za-z0-9]*\.svelte$/.test(file))).toBe(true)
    expect(hookFiles.every(file => file.endsWith('.ts'))).toBe(true)
  })

  it.each(providerEntries)('$name has an example, story, test, and category', ({ category, name, slug }) => {
    const examplePath = Object.keys(providerExamples).find(path => path.includes(`/${slug}/examples/`))
    const storyPath = Object.keys(providerStories).find(path => path.endsWith(`/${slug}/stories/${slug}.stories.ts`))
    const testPath = Object.keys(providerTests).find(path => path.endsWith(`/${slug}/test/${slug}.test.ts`))

    expect(examplePath, `${slug} example`).toBeDefined()
    expect(storyPath, `${slug} story`).toBeDefined()
    expect(testPath, `${slug} test`).toBeDefined()
    expect(providerStories[storyPath!]).toContain(`title: 'Providers / ${category} / ${name}'`)
  })
})
