import type { FocusTrapOptions } from '@destyler/focus-trap'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-svelte'
import { page } from 'vitest/browser'
import Fixture from './FocusTrapFixture.svelte'

vi.mock('@destyler/focus-trap', () => ({ trapFocus: vi.fn() }))

const { trapFocus } = await import('@destyler/focus-trap')

describe('[focus-trap] provider', () => {
  beforeEach(() => {
    vi.mocked(trapFocus).mockReset()
  })

  it('activates the trap when not disabled', async () => {
    vi.mocked(trapFocus).mockReturnValue(vi.fn())
    await render(Fixture)
    await vi.waitFor(() => expect(trapFocus).toHaveBeenCalledTimes(1))
  })

  it('emits activate and deactivate events when the trap callbacks run', async () => {
    let capturedOptions: FocusTrapOptions | undefined
    vi.mocked(trapFocus).mockImplementation((_, options) => {
      capturedOptions = options
      return vi.fn()
    })
    const onActivate = vi.fn()
    const onDeactivate = vi.fn()

    await render(Fixture, { props: { onActivate, onDeactivate } })
    await vi.waitFor(() => expect(capturedOptions).toBeDefined())
    capturedOptions?.onActivate?.()
    capturedOptions?.onDeactivate?.()

    expect(onActivate).toHaveBeenCalledTimes(1)
    expect(onDeactivate).toHaveBeenCalledTimes(1)
  })

  it('does not activate when disabled', async () => {
    await render(Fixture, { props: { disabled: true } })
    expect(trapFocus).not.toHaveBeenCalled()
  })

  it('renders children correctly', async () => {
    vi.mocked(trapFocus).mockReturnValue(vi.fn())
    await render(Fixture)
    await expect.element(page.getByRole('button', { name: 'Test Button' })).toBeVisible()
  })
})
