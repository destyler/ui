import * as library from '$lib'
import { expect, it } from 'vitest'
import packageManifestJson from '../package-manifest.json'

interface ComponentManifestEntry {
  anatomy: string | null
  anatomyExceptions?: string[]
  namespace: string
}

const components = packageManifestJson.components as ComponentManifestEntry[]
const libraryExports = library as unknown as Record<string, unknown>

it('exports every Svelte component namespace', () => {
  expect(components.length).toBeGreaterThan(0)
  for (const { namespace } of components)
    expect(['object', 'function']).toContain(typeof libraryExports[namespace])
})

it('keeps the generic anatomy factory on the anatomy subpath', () => {
  expect(libraryExports.createAnatomy).toBeUndefined()
})

it('exports the shared portal action for copyable Svelte examples', () => {
  expect(typeof libraryExports.portal).toBe('function')
})

it('exports a component for every public anatomy part', () => {
  for (const { anatomy: anatomyName, anatomyExceptions = [], namespace } of components) {
    if (anatomyName === null)
      continue

    const anatomy = libraryExports[anatomyName] as { keys: () => string[] }
    const componentNamespace = libraryExports[namespace] as Record<string, unknown>
    const anatomyExports = anatomy.keys().map(part => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)

    expect(anatomy).toBeDefined()
    for (const exception of anatomyExceptions)
      expect(anatomyExports, `${namespace}.${exception} exception`).toContain(exception)

    for (const exportName of anatomyExports) {
      if (!anatomyExceptions.includes(exportName))
        expect(componentNamespace[exportName], `${namespace}.${exportName}`).toBeDefined()
    }
  }
})
