import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-svelte'
import { page, userEvent } from 'vitest/browser'
import Basic from '../examples/Basic.svelte'
import { Tour, tourAnatomy } from '../index'

const componentExports = Tour as unknown as Record<string, unknown>
const partName = (part: string) => part.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)

describe('[tour] component', () => {
  it.each(tourAnatomy.keys())('renders and exports the %s anatomy part', async (part) => {
    await render(Basic)
    await vi.waitFor(() => {
      expect(document.querySelector(`[data-scope="tour"][data-part="${partName(part)}"]`)).toBeInTheDocument()
    })
    const exportName = `${part.charAt(0).toUpperCase()}${part.slice(1)}`
    expect(componentExports[exportName], `Tour.${exportName}`).toBeDefined()
  })

  it('starts the tour and dismisses it through the close trigger', async () => {
    await render(Basic)
    await vi.waitFor(async () => expect.element(page.getByText('Welcome to the tour!')).toBeVisible())
    await userEvent.click(page.getByRole('button', { name: 'close tour' }))
    await vi.waitFor(async () => expect.element(page.getByText('Welcome to the tour!')).not.toBeInTheDocument())
  })

  it('lazy mounts and unmounts on exit', async () => {
    await render(Basic, { props: { lazyMount: true, unmountOnExit: true } })
    const positioner = page.getByTestId('positioner')
    await vi.waitFor(async () => expect.element(positioner).toBeVisible())
    await userEvent.click(page.getByRole('button', { name: 'close tour' }))
    await vi.waitFor(async () => expect.element(positioner).not.toBeInTheDocument())
  })
})
