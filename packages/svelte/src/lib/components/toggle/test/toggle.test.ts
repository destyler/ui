import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import { userEvent } from 'vitest/browser'
import Basic from '../examples/Basic.svelte'
import { Toggle, toggleAnatomy } from '../index'

const componentExports = Toggle as unknown as Record<string, unknown>
const partName = (part: string) => part.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)

describe('[toggle] component', () => {
  it.each(toggleAnatomy.keys())('renders and exports the %s anatomy part', async (part) => {
    const screen = await render(Basic)
    expect(screen.container.querySelector(`[data-scope="toggle"][data-part="${partName(part)}"]`)).toBeInTheDocument()
    const exportName = `${part.charAt(0).toUpperCase()}${part.slice(1)}`
    expect(componentExports[exportName], `Toggle.${exportName}`).toBeDefined()
  })

  it('toggles pressed state and indicator visibility', async () => {
    const screen = await render(Basic)
    const toggle = screen.getByRole('button', { name: 'Toggle' })
    const indicator = screen.container.querySelector('[data-part="indicator"]')
    await expect.element(toggle).toHaveAttribute('aria-pressed', 'false')
    expect(indicator).toHaveTextContent('')
    await userEvent.click(toggle)
    await expect.element(toggle).toHaveAttribute('aria-pressed', 'true')
    expect(indicator).toHaveTextContent('✓')
  })
})
