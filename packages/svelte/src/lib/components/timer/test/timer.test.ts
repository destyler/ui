import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-svelte'
import { userEvent } from 'vitest/browser'
import Basic from '../examples/Basic.svelte'
import { Timer, timerAnatomy } from '../index'

const componentExports = Timer as unknown as Record<string, unknown>
const skippedParts = ['itemValue', 'itemLabel']
const partName = (part: string) => part.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)

describe('[timer] component', () => {
  it.each(timerAnatomy.keys().filter(part => !skippedParts.includes(part)))('renders and exports the %s anatomy part', async (part) => {
    const screen = await render(Basic)
    await vi.waitFor(() => expect(screen.container.querySelector(`[data-scope="timer"][data-part="${partName(part)}"]`)).toBeInTheDocument())
    const exportName = `${part.charAt(0).toUpperCase()}${part.slice(1)}`
    expect(componentExports[exportName], `Timer.${exportName}`).toBeDefined()
  })

  it('exports only implemented item components', () => {
    expect(componentExports.ItemValue).toBeUndefined()
    expect(componentExports.ItemLabel).toBeUndefined()
  })

  it('pauses, resumes, and resets the timer', async () => {
    const screen = await render(Basic)
    const pause = screen.getByRole('button', { name: 'PAUSE' })
    const resume = screen.getByRole('button', { name: 'RESUME' })
    const reset = screen.getByRole('button', { name: 'RESET' })
    await vi.waitFor(async () => expect.element(pause).toBeVisible())
    await userEvent.click(pause)
    await expect.element(resume).toBeVisible()
    await expect.element(reset).toBeVisible()
    await userEvent.click(resume)
    await vi.waitFor(async () => expect.element(pause).toBeVisible())
    await userEvent.click(pause)
    await userEvent.click(reset)
    await expect.element(screen.getByRole('timer')).toHaveAttribute('aria-label', '0 days 00:01:00')
  })
})
