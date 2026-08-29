import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-svelte'
import { page, userEvent } from 'vitest/browser'
import Basic from '../examples/Basic.svelte'
import { Dialog, dialogAnatomy } from '../index'

const componentExports = Dialog as unknown as Record<string, unknown>
const partName = (part: string) => part.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)

describe('[dialog] component', () => {
  it.each(dialogAnatomy.keys())('renders and exports the %s anatomy part', async (part) => {
    await render(Basic)
    expect(document.querySelector(`[data-scope="dialog"][data-part="${partName(part)}"]`)).toBeInTheDocument()
    const exportName = `${part.charAt(0).toUpperCase()}${part.slice(1)}`
    expect(componentExports[exportName], `Dialog.${exportName}`).toBeDefined()
  })

  it('opens and closes the dialog', async () => {
    await render(Basic)
    await userEvent.click(page.getByText('Open Dialog'))
    await vi.waitFor(async () => expect.element(page.getByText('Dialog Title')).toBeVisible())
    await userEvent.click(page.getByText('Close'))
    await vi.waitFor(async () => expect.element(page.getByText('Dialog Title')).not.toBeVisible())
  })

  it('lazy mounts and unmounts on exit', async () => {
    await render(Basic, { props: { lazyMount: true, unmountOnExit: true } })
    await expect.element(page.getByTestId('positioner')).not.toBeInTheDocument()
    await userEvent.click(page.getByText('Open Dialog'))
    await expect.element(page.getByTestId('positioner')).toBeInTheDocument()
    await userEvent.click(page.getByText('Close'))
    await vi.waitFor(async () => expect.element(page.getByTestId('positioner')).not.toBeInTheDocument())
  })
})
