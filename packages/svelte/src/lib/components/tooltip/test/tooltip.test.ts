import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-svelte'
import { page, userEvent } from 'vitest/browser'
import Basic from '../examples/Basic.svelte'
import Controlled from '../examples/Controlled.svelte'
import RootProvider from '../examples/RootProvider.svelte'
import Timings from '../examples/Timings.svelte'
import { Tooltip, tooltipAnatomy } from '../index'

const componentExports = Tooltip as unknown as Record<string, unknown>
const partName = (part: string) => part.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)

describe('[tooltip] component', () => {
  it.each(tooltipAnatomy.keys())('renders and exports the %s anatomy part', async (part) => {
    await render(Basic)
    expect(document.querySelector(`[data-scope="tooltip"][data-part="${partName(part)}"]`)).toBeInTheDocument()
    const exportName = `${part.charAt(0).toUpperCase()}${part.slice(1)}`
    expect(componentExports[exportName], `Tooltip.${exportName}`).toBeDefined()
  })

  it('opens on trigger hover', async () => {
    await render(Timings)
    await userEvent.hover(page.getByRole('button', { name: 'Hover Me' }))
    await vi.waitFor(async () => expect.element(page.getByText('I am a tooltip!')).toBeVisible())
  })

  it('works in controlled mode', async () => {
    await render(Controlled)
    const content = page.getByText('I am a tooltip!')
    await expect.element(content).not.toBeVisible()
    await userEvent.click(page.getByRole('button', { name: 'Toggle' }))
    await vi.waitFor(async () => expect.element(content).toBeVisible())
  })

  it('opens through the RootProvider api', async () => {
    await render(RootProvider)
    await userEvent.click(page.getByRole('button', { name: 'Open' }))
    await vi.waitFor(async () => expect.element(page.getByText('I am a tooltip!')).toBeVisible())
  })
})
