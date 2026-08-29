import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-svelte'
import { page, userEvent } from 'vitest/browser'
import Basic from '../examples/Basic.svelte'
import Events from '../examples/Events.svelte'
import RenderProp from '../examples/RenderProp.svelte'
import RootProvider from '../examples/RootProvider.svelte'
import Vertical from '../examples/Vertical.svelte'
import { Splitter, splitterAnatomy } from '../index'

const componentExports = Splitter as unknown as Record<string, unknown>
const partName = (part: string) => part.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)

describe('[splitter] component', () => {
  it.each(splitterAnatomy.keys())('renders and exports the %s anatomy part', async (part) => {
    await render(Basic)
    expect(document.querySelector(`[data-scope="splitter"][data-part="${partName(part)}"]`)).toBeInTheDocument()
    const exportName = `${part.charAt(0).toUpperCase()}${part.slice(1)}`
    expect(componentExports[exportName], `Splitter.${exportName}`).toBeDefined()
  })

  it('renders two panels and a resize trigger', async () => {
    const screen = await render(Basic)
    await expect.element(screen.getByText('A')).toBeVisible()
    await expect.element(screen.getByText('B')).toBeVisible()
    expect(screen.container.querySelectorAll('[data-part="panel"]')).toHaveLength(2)
    expect(screen.container.querySelector('[data-part="resize-trigger"]')).toBeInTheDocument()
  })

  it('resizes panels with the core keyboard behavior', async () => {
    const screen = await render(Basic)
    const trigger = page.getByRole('separator')
    const triggerElement = document.querySelector('[data-part="resize-trigger"]') as HTMLElement
    const firstPanel = screen.container.querySelector('[data-part="panel"]') as HTMLElement
    const before = firstPanel.style.flexGrow
    triggerElement.focus()
    await expect.element(trigger).toHaveFocus()
    await userEvent.keyboard('{ArrowRight}')
    await vi.waitFor(() => expect(firstPanel.style.flexGrow).not.toBe(before))
  })

  it('supports events, render props, RootProvider, and vertical orientation', async () => {
    const events = await render(Events)
    await expect.element(events.getByText('A')).toBeVisible()
    events.unmount()

    const renderProp = await render(RenderProp)
    await expect.element(renderProp.getByText('Set A to 10%')).toBeVisible()
    renderProp.unmount()

    const provider = await render(RootProvider)
    await expect.element(provider.getByText('Maximize a')).toBeVisible()
    provider.unmount()

    await render(Vertical)
    await expect.element(page.getByRole('separator')).toHaveAttribute('aria-orientation', 'vertical')
  })
})
