import type { FocusTrapProps } from '../'
import { render, screen, waitFor } from '@solidjs/testing-library'
import { createComponent } from 'solid-js'
import { FocusTrap } from '../'

describe('focus trap', () => {
  it('derives an autofocus target without assigning it back to props', async () => {
    const setInitialFocus = vi.fn()
    const props = {
      get initialFocus() {
        return undefined
      },
      set initialFocus(value) {
        setInitialFocus(value)
      },
      get children() {
        return <button data-autofocus>Autofocus target</button>
      },
    } as FocusTrapProps

    render(() => createComponent(FocusTrap, props))

    await waitFor(() => expect(screen.getByRole('button')).toHaveFocus())
    expect(setInitialFocus).not.toHaveBeenCalled()
  })
})
