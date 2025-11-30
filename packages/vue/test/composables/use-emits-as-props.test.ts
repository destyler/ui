import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-vue'
import { page, userEvent } from 'vitest/browser'
import UseEmitAsPropsBasic from './UseEmitAsPropsBasic.vue'

describe('composable: useEmitAsProps', () => {
  it('should convert emit to handler props', async () => {
    const onClick = vi.fn()
    const onChange = vi.fn()

    render(UseEmitAsPropsBasic, {
      props: {
        onClick,
        onChange,
      },
    })

    const button = page.getByTestId('button')
    await userEvent.click(button)

    expect(onClick).toHaveBeenCalled()
  })

  it('should handle multiple emits', async () => {
    const onFocus = vi.fn()
    const onBlur = vi.fn()

    render(UseEmitAsPropsBasic, {
      props: {
        onFocus,
        onBlur,
      },
    })

    const input = page.getByTestId('input')
    await userEvent.click(input)

    await vi.waitFor(() => {
      expect(onFocus).toHaveBeenCalled()
    })

    await userEvent.click(page.getByTestId('button'))

    await vi.waitFor(() => {
      expect(onBlur).toHaveBeenCalled()
    })
  })

  it('should pass event arguments', async () => {
    const onCustom = vi.fn()

    render(UseEmitAsPropsBasic, {
      props: {
        onCustom,
      },
    })

    const customButton = page.getByTestId('custom-button')
    await userEvent.click(customButton)

    expect(onCustom).toHaveBeenCalledWith('custom-value', 123)
  })
})
