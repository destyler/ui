import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-svelte'
import { page, userEvent } from 'vitest/browser'
import Basic from '../examples/Basic.svelte'
import Controlled from '../examples/Controlled.svelte'
import RootProvider from '../examples/RootProvider.svelte'
import { HoverCard, hoverCardAnatomy } from '../index'

const componentExports = HoverCard as unknown as Record<string, unknown>
const partName = (part: string) => part.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)

describe('[hover-card] component', () => {
  it.each(hoverCardAnatomy.keys())('renders and exports the %s anatomy part', async (part) => {
    await render(Basic)
    expect(document.querySelector(`[data-scope="hover-card"][data-part="${partName(part)}"]`)).toBeInTheDocument()
    const exportName = `${part.charAt(0).toUpperCase()}${part.slice(1)}`
    expect(componentExports[exportName], `HoverCard.${exportName}`).toBeDefined()
  })

  it('opens and closes on hover', async () => {
    await render(Basic)
    const target = page.getByText('Hover me')
    const content = page.getByText('Content')
    await userEvent.hover(target)
    await vi.waitFor(async () => expect.element(content).toBeVisible())
    await userEvent.unhover(target)
    await vi.waitFor(async () => expect.element(content).not.toBeVisible())
  })

  it('invokes onOpenChange', async () => {
    const onOpenChange = vi.fn()
    await render(Basic, { props: { onOpenChange } })
    await userEvent.hover(page.getByText('Hover me'))
    await vi.waitFor(() => expect(onOpenChange).toHaveBeenCalledTimes(1))
  })

  it('works in controlled mode and through RootProvider', async () => {
    const controlled = await render(Controlled)
    await userEvent.click(controlled.getByRole('button', { name: 'Open HoverCard' }))
    await vi.waitFor(async () => expect.element(page.getByText('Content')).toBeVisible())
    controlled.unmount()

    await render(RootProvider)
    await userEvent.click(page.getByRole('button', { name: 'Open' }))
    await vi.waitFor(async () => expect.element(page.getByText('Content')).toBeVisible())
  })

  it('lazy mounts and unmounts on exit', async () => {
    await render(Basic, { props: { lazyMount: true, unmountOnExit: true } })
    const positioner = page.getByTestId('positioner')
    await expect.element(positioner).not.toBeInTheDocument()
    await userEvent.hover(page.getByText('Hover me'))
    await expect.element(positioner).toBeInTheDocument()
    await userEvent.unhover(page.getByText('Hover me'))
    await vi.waitFor(async () => expect.element(positioner).not.toBeInTheDocument())
  })
})
