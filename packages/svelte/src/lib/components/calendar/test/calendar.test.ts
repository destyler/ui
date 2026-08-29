import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-svelte'
import { page, userEvent } from 'vitest/browser'
import Basic from '../examples/Basic.svelte'
import Controlled from '../examples/Controlled.svelte'
import Range from '../examples/Range.svelte'
import RootProvider from '../examples/RootProvider.svelte'
import Standalone from '../examples/Standalone.svelte'
import { Calendar, calendarAnatomy } from '../index'

const componentExports = Calendar as unknown as Record<string, unknown>
const partName = (part: string) => part.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)

describe('[calendar] component', () => {
  it('renders and exports every anatomy part', async () => {
    const screen = await render(Basic)
    await userEvent.click(screen.getByRole('button', { name: 'Open calendar' }))
    for (const part of calendarAnatomy.keys()) {
      expect(
        screen.container.querySelector(`[data-scope="calendar"][data-part="${partName(part)}"]`),
        `calendar.${part}`,
      ).toBeInTheDocument()
      const exportName = `${part.charAt(0).toUpperCase()}${part.slice(1)}`
      expect(componentExports[exportName], `Calendar.${exportName}`).toBeDefined()
    }
  })

  it('lazy mounts and keeps content mounted after closing by default', async () => {
    await render(Basic, { props: { lazyMount: true } })
    const positioner = page.getByTestId('positioner')
    await expect.element(positioner).not.toBeInTheDocument()
    await userEvent.click(page.getByRole('button', { name: 'Open calendar' }))
    await expect.element(positioner).toBeInTheDocument()
    await userEvent.click(page.getByRole('button', { name: 'Close calendar' }))
    await expect.element(positioner).toBeInTheDocument()
    await expect.element(positioner).not.toBeVisible()
  })

  it('unmounts content on exit when requested', async () => {
    await render(Basic, { props: { lazyMount: true, unmountOnExit: true } })
    const positioner = page.getByTestId('positioner')
    await userEvent.click(page.getByRole('button', { name: 'Open calendar' }))
    await expect.element(positioner).toBeInTheDocument()
    await userEvent.click(page.getByRole('button', { name: 'Close calendar' }))
    await vi.waitFor(async () => expect.element(positioner).not.toBeInTheDocument())
  })

  it('selects and clears a date', async () => {
    const screen = await render(Basic)
    const input = screen.getByRole('textbox', { name: 'Label' })
    await userEvent.click(screen.getByRole('button', { name: 'Open calendar' }))
    const day = screen.container.querySelector<HTMLElement>('[data-part="table-cell-trigger"]:not([data-disabled])')
    expect(day).not.toBeNull()
    await userEvent.click(day!)
    await vi.waitFor(() => expect((input.element() as HTMLInputElement).value).not.toBe(''))
    await userEvent.click(screen.getByRole('button', { name: 'Clear' }))
    await expect.element(input).toHaveValue('')
  })

  it('renders controlled, range, provider, and standalone examples', async () => {
    const controlled = await render(Controlled)
    await expect.element(controlled.getByRole('textbox')).not.toHaveValue('')
    controlled.unmount()

    const range = await render(Range)
    expect(range.container.querySelectorAll('input')).toHaveLength(2)
    range.unmount()

    const provider = await render(RootProvider)
    await userEvent.click(provider.getByText('📅'))
    await expect.element(provider.getByRole('grid')).toBeVisible()
    provider.unmount()

    const standalone = await render(Standalone)
    await expect.element(standalone.getByRole('grid')).toBeVisible()
  })
})
