import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-svelte'
import { page, userEvent } from 'vitest/browser'
import DisabledFixture from './DisabledFocusTrapFixture.svelte'
import BehaviorFixture from './FocusTrapBehaviorFixture.svelte'

describe('[focus-trap] provider', () => {
  it('uses the requested initial focus and emits activation', async () => {
    await render(BehaviorFixture)

    await userEvent.click(page.getByRole('button', { name: 'Open trap' }))

    await vi.waitFor(async () => {
      await expect.element(page.getByRole('button', { name: 'Initial focus' })).toHaveFocus()
    })
    await expect.element(page.getByTestId('lifecycle')).toHaveTextContent('1:0')
  })

  it('keeps forward and backward keyboard focus inside the trap', async () => {
    await render(BehaviorFixture)
    await userEvent.click(page.getByRole('button', { name: 'Open trap' }))

    const first = page.getByRole('button', { name: 'First' })
    const initial = page.getByRole('button', { name: 'Initial focus' })
    const close = page.getByRole('button', { name: 'Close trap' })
    await vi.waitFor(async () => await expect.element(initial).toHaveFocus())

    await userEvent.tab()
    await expect.element(close).toHaveFocus()
    await userEvent.tab()
    await expect.element(first).toHaveFocus()
    await userEvent.tab({ shift: true })
    await expect.element(close).toHaveFocus()
  })

  it('deactivates on removal and returns focus to the trigger', async () => {
    await render(BehaviorFixture)
    const trigger = page.getByRole('button', { name: 'Open trap' })

    await userEvent.click(trigger)
    await vi.waitFor(async () => {
      await expect.element(page.getByRole('button', { name: 'Initial focus' })).toHaveFocus()
    })
    await userEvent.click(page.getByRole('button', { name: 'Close trap' }))

    await expect.element(page.getByRole('button', { name: 'Close trap' })).not.toBeInTheDocument()
    await expect.element(page.getByTestId('lifecycle')).toHaveTextContent('1:1')
    await vi.waitFor(async () => await expect.element(trigger).toHaveFocus())
  })

  it('allows focus to leave when disabled', async () => {
    await render(DisabledFixture)

    await userEvent.click(page.getByRole('button', { name: 'Inside disabled trap' }))
    await expect.element(page.getByRole('button', { name: 'Inside disabled trap' })).toHaveFocus()

    await userEvent.click(page.getByRole('button', { name: 'Outside disabled trap' }))
    await expect.element(page.getByRole('button', { name: 'Outside disabled trap' })).toHaveFocus()
  })
})
