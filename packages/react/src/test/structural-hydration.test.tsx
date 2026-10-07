import { act } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { renderToString } from 'react-dom/server'
import { expect, it, vi } from 'vitest'
import { AspectRatio } from '../components/aspect-ratio'
import { Breadcrumbs } from '../components/breadcrumbs'
import { Label } from '../components/label'
import { Separator } from '../components/separator'

vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)

it('hydrates structural markup without replacing nodes or changing generated IDs', async () => {
  const view = (
    <>
      <AspectRatio.Root ratio={2}><AspectRatio.Content>Media</AspectRatio.Content></AspectRatio.Root>
      <Breadcrumbs.Root items={[]}><Breadcrumbs.List /></Breadcrumbs.Root>
      <Label.Root htmlFor="hydrated-field">Name</Label.Root><input id="hydrated-field" />
      <Separator.Root orientation="vertical" />
    </>
  )
  const host = document.createElement('main')
  const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
  const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {})
  const recoverable = vi.fn()
  let root: ReturnType<typeof hydrateRoot> | undefined
  try {
    host.innerHTML = renderToString(view)
    document.body.append(host)
    const originalNodes = Array.from(host.querySelectorAll('[data-part]'))
    const originalIds = originalNodes.map(node => node.id)
    expect(originalNodes).toHaveLength(6)

    await act(async () => {
      root = hydrateRoot(host, view, { onRecoverableError: recoverable })
    })

    const hydratedNodes = Array.from(host.querySelectorAll('[data-part]'))
    expect(hydratedNodes).toHaveLength(6)
    originalNodes.forEach((node, index) => {
      expect(hydratedNodes[index]).toBe(node)
    })
    expect(hydratedNodes.map(node => node.id)).toEqual(originalIds)
    expect(recoverable).not.toHaveBeenCalled()
    expect(consoleError).not.toHaveBeenCalled()
    expect(consoleWarn).not.toHaveBeenCalled()
    expect(host.querySelector('label')?.htmlFor).toBe('hydrated-field')
  }
  finally {
    try {
      await act(async () => root?.unmount())
    }
    finally {
      host.remove()
      consoleError.mockRestore()
      consoleWarn.mockRestore()
    }
  }
})
