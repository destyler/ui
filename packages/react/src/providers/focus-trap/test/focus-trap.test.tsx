import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { page } from 'vitest/browser'

vi.mock('@destyler/focus-trap', () => ({
  trapFocus: vi.fn(),
}))

const { trapFocus } = await import('@destyler/focus-trap')
type FocusTrapOptions = Parameters<typeof trapFocus>[1]

const { FocusTrap } = await import('../index')

describe('[focus-trap] provider', () => {
  beforeEach(() => {
    vi.mocked(trapFocus).mockReset()
  })

  it('activates the trap when not disabled', async () => {
    const cleanup = vi.fn()
    vi.mocked(trapFocus).mockReturnValue(cleanup)

    render(
      <FocusTrap data-testid="trap-root">
        <button type="button">Inside trap</button>
      </FocusTrap>,
    )

    expect(trapFocus).toHaveBeenCalledTimes(1)
  })

  it('emits activate and deactivate events when the trap callbacks run', async () => {
    let capturedOptions: FocusTrapOptions | undefined
    vi.mocked(trapFocus).mockImplementation((_, options) => {
      capturedOptions = options
      return vi.fn()
    })

    const activate = vi.fn()
    const deactivate = vi.fn()

    render(
      <FocusTrap onActivate={activate} onDeactivate={deactivate}>
        <button type="button">Inside trap</button>
      </FocusTrap>,
    )

    expect(capturedOptions).toBeDefined()

    capturedOptions?.onActivate?.()
    capturedOptions?.onDeactivate?.()

    expect(activate).toHaveBeenCalledTimes(1)
    expect(deactivate).toHaveBeenCalledTimes(1)
  })

  it('does not activate when disabled', async () => {
    render(
      <FocusTrap disabled>
        <button type="button">Inside trap</button>
      </FocusTrap>,
    )

    expect(trapFocus).not.toHaveBeenCalled()
  })

  it('renders children correctly', async () => {
    vi.mocked(trapFocus).mockReturnValue(vi.fn())

    render(
      <FocusTrap>
        <button type="button">Test Button</button>
      </FocusTrap>,
    )

    await expect.element(page.getByRole('button', { name: 'Test Button' })).toBeVisible()
  })
})
