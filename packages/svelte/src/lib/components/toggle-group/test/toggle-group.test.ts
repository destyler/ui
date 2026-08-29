import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import { userEvent } from 'vitest/browser'
import Basic from '../examples/Basic.svelte'
import Controlled from '../examples/Controlled.svelte'
import Multiple from '../examples/Multiple.svelte'
import RootProvider from '../examples/RootProvider.svelte'
import { ToggleGroup, toggleGroupAnatomy } from '../index'

const componentExports = ToggleGroup as unknown as Record<string, unknown>
const partName = (part: string) => part.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)

describe('[toggle-group] component', () => {
  it.each(toggleGroupAnatomy.keys())('renders and exports the %s anatomy part', async (part) => {
    const screen = await render(Basic)
    expect(screen.container.querySelector(`[data-scope="toggle-group"][data-part="${partName(part)}"]`)).toBeInTheDocument()
    const exportName = `${part.charAt(0).toUpperCase()}${part.slice(1)}`
    expect(componentExports[exportName], `ToggleGroup.${exportName}`).toBeDefined()
  })

  it('selects one item at a time', async () => {
    const screen = await render(Basic)
    const first = screen.getByRole('radio', { name: 'A' })
    const second = screen.getByRole('radio', { name: 'B' })
    await userEvent.click(first)
    await expect.element(first).toHaveAttribute('aria-checked', 'true')
    await userEvent.click(second)
    await expect.element(screen.getByRole('radio', { name: 'A' })).toHaveAttribute('aria-checked', 'false')
    await expect.element(screen.getByRole('radio', { name: 'B' })).toHaveAttribute('aria-checked', 'true')
  })

  it('synchronizes controlled value and supports multiple selection', async () => {
    const controlled = await render(Controlled)
    await userEvent.click(controlled.getByRole('radio', { name: 'B' }))
    await expect.element(controlled.getByRole('radio', { name: 'A' })).toHaveAttribute('aria-checked', 'false')
    await expect.element(controlled.getByRole('radio', { name: 'B' })).toHaveAttribute('aria-checked', 'true')
    controlled.unmount()

    const multiple = await render(Multiple)
    await userEvent.click(multiple.getByRole('button', { name: 'C' }))
    for (const name of ['A', 'B', 'C'])
      await expect.element(multiple.getByRole('button', { name })).toHaveAttribute('data-state', 'on')
  })

  it('keeps the RootProvider value in the styled span used by React and Vue', async () => {
    const screen = await render(RootProvider)
    expect(screen.container.querySelector(':scope > span')).toBeInTheDocument()
  })
})
