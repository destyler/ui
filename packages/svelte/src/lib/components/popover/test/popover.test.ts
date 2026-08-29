import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-svelte'
import { page, userEvent } from 'vitest/browser'
import Basic from '../examples/Basic.svelte'
import { Popover, popoverAnatomy } from '../index'

const componentExports = Popover as unknown as Record<string, unknown>
const partName = (part: string) => part.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)

describe('[popover] component', () => {
  it.each(popoverAnatomy.keys())('renders and exports the %s anatomy part', async (part) => {
    await render(Basic)
    expect(document.querySelector(`[data-scope="popover"][data-part="${partName(part)}"]`)).toBeInTheDocument()
    const exportName = `${part.charAt(0).toUpperCase()}${part.slice(1)}`
    expect(componentExports[exportName], `Popover.${exportName}`).toBeDefined()
  })

  it('opens and closes', async () => {
    await render(Basic)
    await userEvent.click(page.getByText('click me'))
    await expect.element(page.getByRole('dialog')).toBeVisible()
    await userEvent.click(page.getByText('close'))
    await vi.waitFor(async () => expect.element(page.getByText('title')).not.toBeVisible())
  })

  it('closes when Escape is pressed', async () => {
    await render(Basic)
    await userEvent.click(page.getByText('click me'))
    await expect.element(page.getByRole('dialog')).toBeVisible()
    await userEvent.keyboard('[Escape]')
    await vi.waitFor(async () => expect.element(page.getByText('title')).not.toBeVisible())
  })

  it('lazy mounts without unmounting on exit', async () => {
    await render(Basic, { props: { lazyMount: true } })
    const positioner = page.getByTestId('positioner')
    await expect.element(positioner).not.toBeInTheDocument()
    await userEvent.click(page.getByRole('button', { name: 'click me' }))
    await expect.element(positioner).toBeInTheDocument()
    await userEvent.click(page.getByRole('button', { name: 'close' }))
    await expect.element(positioner).toBeInTheDocument()
  })

  it('lazy mounts and unmounts on exit', async () => {
    await render(Basic, { props: { lazyMount: true, unmountOnExit: true } })
    const positioner = page.getByTestId('positioner')
    await expect.element(positioner).not.toBeInTheDocument()
    await userEvent.click(page.getByRole('button', { name: 'click me' }))
    await expect.element(positioner).toBeInTheDocument()
    await userEvent.click(page.getByRole('button', { name: 'close' }))
    await vi.waitFor(async () => expect.element(positioner).not.toBeInTheDocument())
  })
})
