import type { FocusTrapOptions } from '@destyler/focus-trap'
import { trapFocus } from '@destyler/focus-trap'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-vue'
import { page, userEvent } from 'vitest/browser'
import { nextTick } from 'vue'
import { FocusTrap } from '../index'
import FocusTrapBasic from './fixtures/FocusTrapBasic.vue'
import FocusTrapToggle from './fixtures/FocusTrapToggle.vue'

vi.mock('@destyler/focus-trap', () => ({
  trapFocus: vi.fn(),
}))

describe('[focus-trap] provider', () => {
  beforeEach(() => {
    vi.mocked(trapFocus).mockReset()
  })

  it('activates the trap with the detected auto focus target', async () => {
    const cleanup = vi.fn()
    vi.mocked(trapFocus).mockReturnValue(cleanup)

    render(FocusTrapBasic)
    await nextTick()

    expect(trapFocus).toHaveBeenCalledTimes(1)
    const [node, options] = vi.mocked(trapFocus).mock.calls[0]

    await expect.element(page.getByTestId('trap-root')).toBeVisible()
    const autoFocus = (node as HTMLElement).querySelector('[data-autofocus]')
    expect(options?.initialFocus).toBe(autoFocus ?? undefined)
  })

  it('emits activate and deactivate events when the trap callbacks run', async () => {
    let capturedOptions: FocusTrapOptions | undefined
    vi.mocked(trapFocus).mockImplementation((_, options) => {
      capturedOptions = options
      return vi.fn()
    })

    const activate = vi.fn()
    const deactivate = vi.fn()

    render(FocusTrap, {
      props: {
        onActivate: activate,
        onDeactivate: deactivate,
      },
      slots: {
        default: '<div><button type="button">Inside trap</button></div>',
      },
    })

    await nextTick()
    expect(capturedOptions).toBeDefined()

    capturedOptions?.onActivate?.()
    capturedOptions?.onDeactivate?.()

    expect(activate).toHaveBeenCalledTimes(1)
    expect(deactivate).toHaveBeenCalledTimes(1)
  })

  it('cleans up the trap when unmounted', async () => {
    const cleanup = vi.fn()
    vi.mocked(trapFocus).mockReturnValue(cleanup)

    render(FocusTrapToggle)
    await nextTick()

    await userEvent.click(page.getByTestId('toggle'))

    expect(cleanup).toHaveBeenCalledTimes(2)
  })

  it('does not activate when disabled', async () => {
    render(FocusTrap, {
      props: {
        disabled: true,
      },
      slots: {
        default: '<div><button type="button">Disabled trap</button></div>',
      },
    })

    expect(trapFocus).not.toHaveBeenCalled()
  })
})
