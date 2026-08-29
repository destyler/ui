import type { Component } from 'svelte'
import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-svelte'
import { page } from 'vitest/browser'
import Basic from '../examples/Basic.svelte'
import Close from '../examples/Close.svelte'
import Event from '../examples/Event.svelte'
import RootProvider from '../examples/RootProvider.svelte'
import { Avatar, avatarAnatomy } from '../index'

const componentExports = Avatar as unknown as Record<string, unknown>
const partName = (part: string) => part.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)

describe('[avatar] component', () => {
  it.each(avatarAnatomy.keys())('renders and exports the %s anatomy part', async (part) => {
    const screen = await render(Basic)
    expect(screen.container.querySelector(`[data-scope="image"][data-part="${partName(part)}"]`)).toBeInTheDocument()
    const exportName = `${part.charAt(0).toUpperCase()}${part.slice(1)}`
    expect(componentExports[exportName], `Avatar.${exportName}`).toBeDefined()
  })

  it('derives fallback initials and forwards image attributes', async () => {
    await render(Close, { props: { name: 'Ada Lovelace', src: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==' } })
    await expect.element(page.getByText('AL')).toBeInTheDocument()
    await expect.element(page.getByRole('img', { name: 'Ada Lovelace' })).toHaveAttribute('src', expect.stringContaining('data:image/gif'))
  })

  it('reports image loading state', async () => {
    await render(Event, { props: { src: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==' } })
    await vi.waitFor(async () => {
      const status = page.getByText(/Status:/)
      await expect.element(status).not.toHaveTextContent('loading...')
    })
  })

  it.each([
    ['Event', Event],
    ['RootProvider', RootProvider],
  ] as const)('keeps the %s layout inside the shared stack wrapper', async (_, component) => {
    const screen = await render(component as Component<any>)
    expect(screen.container.querySelector(':scope > .stack')).toBeInTheDocument()
  })
})
