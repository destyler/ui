import { expect, vi } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { trackDocumentListeners } from './document-listeners'

// This Chromium browser-mode regression intentionally asserts click-to-focus.
// Other engines need their own native focus expectations, not a weaker assertion.
// The listener readiness check below is separate from this held-press duration.
const heldPressDurationMs = 100

const settle = () => new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())))

// Run against the actual Controlled example, not a fixture duplicating its fix.
export async function checkControlledMenu() {
  const external = page.getByRole('button', { name: 'Trigger from the outside' })
  const item = page.getByText('React', { exact: true })
  const listeners = trackDocumentListeners(document, 'pointerdown')
  const button = external.element()
  const events: string[] = []
  const record = (event: Event) => events.push(event.type)
  for (const type of ['pointerdown', 'focusin', 'click'])
    button.addEventListener(type, record)

  try {
    for (let cycle = 0; cycle < 3; cycle++) {
      await userEvent.click(external)
      await expect.element(item).toBeVisible()
      // Visibility alone does not mean the deferred outside listener is ready.
      await vi.waitFor(() => listeners.expectActive())
      await expect.element(page.getByRole('menu')).toHaveFocus()
      events.length = 0
      // Real browser pointerdown -> focus -> click, with time for deferred
      // outside dismissal before pointerup/click (a normal held mouse press).
      await userEvent.click(external, { delay: heldPressDurationMs })
      expect(events).toEqual(['pointerdown', 'focusin', 'click'])
      await expect.element(item).not.toBeVisible()
      await settle()
      expect(item.element()).not.toBeVisible()
      await vi.waitFor(() => listeners.expectEmpty())
    }

    // Focus alone deliberately leaves the toggle in control; keyboard activation
    // still closes it. This tests focus directly without assuming a Tab order.
    await userEvent.click(external)
    await expect.element(item).toBeVisible()
    await vi.waitFor(() => listeners.expectActive())
    await expect.element(page.getByRole('menu')).toHaveFocus()
    ;(button as HTMLButtonElement).focus()
    await settle()
    expect(button).toHaveFocus()
    expect(item.element()).toBeVisible()
    await userEvent.keyboard('{Enter}')
    await expect.element(item).not.toBeVisible()
    await settle()
    expect(item.element()).not.toBeVisible()
    await vi.waitFor(() => listeners.expectEmpty())

    // Only the external toggle is exempt; ordinary outside clicks still close.
    await userEvent.click(external)
    await expect.element(item).toBeVisible()
    await vi.waitFor(() => listeners.expectActive())
    await userEvent.click(document.body)
    await expect.element(item).not.toBeVisible()
    await settle()
    expect(item.element()).not.toBeVisible()
    await vi.waitFor(() => listeners.expectEmpty())
  }
  finally {
    for (const type of ['pointerdown', 'focusin', 'click'])
      button.removeEventListener(type, record)
    listeners.restore()
  }
}
