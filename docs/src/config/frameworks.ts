export const frameworks = [
  {
    id: 'vue',
    label: 'Vue',
    icon: 'i-tabler-brand-vue',
    packageName: '@destyler-ui/vue',
    packageDirectory: 'packages/vue',
    sourceRoot: 'packages/vue/src',
    sourceDirectory: 'packages/vue/src/components',
    providerSourceDirectory: 'packages/vue/src/providers',
    extension: 'vue',
    exampleWrapper: 'VueExample.vue',
    language: 'vue',
    markupLanguage: 'vue-html',
    sourceAlias: '~/',
    commentStyle: 'html',
  },
  {
    id: 'react',
    label: 'React',
    icon: 'i-tabler-brand-react',
    packageName: '@destyler-ui/react',
    packageDirectory: 'packages/react',
    sourceRoot: 'packages/react/src',
    sourceDirectory: 'packages/react/src/components',
    providerSourceDirectory: 'packages/react/src/providers',
    extension: 'tsx',
    exampleWrapper: 'ReactExample.tsx',
    language: 'tsx',
    markupLanguage: 'tsx',
    sourceAlias: '~/',
    commentStyle: 'line',
  },
  {
    id: 'solid',
    label: 'Solid',
    icon: 'i-tabler-brand-solidjs',
    packageName: '@destyler-ui/solid',
    packageDirectory: 'packages/solid',
    sourceRoot: 'packages/solid/src',
    sourceDirectory: 'packages/solid/src/components',
    providerSourceDirectory: 'packages/solid/src/providers',
    extension: 'tsx',
    exampleWrapper: 'SolidExample.tsx',
    language: 'tsx',
    markupLanguage: 'tsx',
    sourceAlias: '~/',
    commentStyle: 'line',
  },
  {
    id: 'svelte',
    label: 'Svelte',
    icon: 'i-tabler-brand-svelte',
    packageName: '@destyler-ui/svelte',
    packageDirectory: 'packages/svelte',
    sourceRoot: 'packages/svelte/src/lib',
    sourceDirectory: 'packages/svelte/src/lib/components',
    providerSourceDirectory: 'packages/svelte/src/lib/providers',
    extension: 'svelte',
    exampleWrapper: 'SvelteExample.svelte',
    language: 'svelte',
    markupLanguage: 'svelte',
    sourceAlias: '$lib/',
    commentStyle: 'html',
  },
] as const

export type Framework = typeof frameworks[number]['id']
export type FrameworkDefinition = typeof frameworks[number]

export const defaultFramework: Framework = 'vue'
export const frameworkIds = frameworks.map(framework => framework.id)

export function isFramework(value: string | null | undefined): value is Framework {
  return frameworkIds.includes(value as Framework)
}

export function getFramework(frameworkId: Framework): FrameworkDefinition {
  const framework = frameworks.find(candidate => candidate.id === frameworkId)
  if (!framework)
    throw new Error(`Unknown framework: ${frameworkId}`)
  return framework
}

/**
 * Return the path below a framework's private source alias.
 *
 * Both the alias root (`$lib`) and child paths (`$lib/types`) are valid. The
 * registry stores the child-path form with a trailing slash so prefix checks
 * cannot accidentally match similarly named packages.
 */
export function getFrameworkSourceAliasPath(
  framework: FrameworkDefinition,
  specifier: string,
): string | null {
  const aliasRoot = framework.sourceAlias.endsWith('/')
    ? framework.sourceAlias.slice(0, -1)
    : framework.sourceAlias

  if (specifier === aliasRoot)
    return ''
  if (specifier.startsWith(framework.sourceAlias))
    return specifier.slice(framework.sourceAlias.length)
  return null
}
