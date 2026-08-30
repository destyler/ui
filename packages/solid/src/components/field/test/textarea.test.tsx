import { render, screen, waitFor } from '@solidjs/testing-library'
import { createSignal } from 'solid-js'
import { Field } from '../'

describe('field / Textarea', () => {
  it('reacts to autoresize changes and tears down the previous observers', async () => {
    const observe = vi.spyOn(ResizeObserver.prototype, 'observe')
    const disconnect = vi.spyOn(ResizeObserver.prototype, 'disconnect')
    const [autoresize, setAutoresize] = createSignal(false)

    render(() => (
      <Field.Root>
        <Field.Label>Biography</Field.Label>
        <Field.Textarea autoresize={autoresize()} />
      </Field.Root>
    ))

    const textarea = screen.getByRole('textbox', { name: 'Biography' })
    expect(textarea).not.toHaveStyle({ resize: 'none' })
    expect(observe).not.toHaveBeenCalled()

    setAutoresize(true)

    await waitFor(() => {
      expect(textarea).toHaveStyle({ resize: 'none' })
      expect(observe).toHaveBeenCalled()
    })

    setAutoresize(false)

    await waitFor(() => {
      expect(textarea).not.toHaveStyle({ resize: 'none' })
      expect(disconnect).toHaveBeenCalled()
    })

    observe.mockRestore()
    disconnect.mockRestore()
  })

  it('tears down autoresize observers when unmounted', async () => {
    const observe = vi.spyOn(ResizeObserver.prototype, 'observe')
    const disconnect = vi.spyOn(ResizeObserver.prototype, 'disconnect')
    const result = render(() => (
      <Field.Root>
        <Field.Textarea autoresize />
      </Field.Root>
    ))

    await waitFor(() => expect(observe).toHaveBeenCalled())
    result.unmount()

    await waitFor(() => expect(disconnect).toHaveBeenCalled())
    observe.mockRestore()
    disconnect.mockRestore()
  })

  it('preserves the user ref while autoresize receives the same element', async () => {
    const observe = vi.spyOn(ResizeObserver.prototype, 'observe')
    const userRef = vi.fn()
    const result = render(() => (
      <Field.Root>
        <Field.Label>Biography</Field.Label>
        <Field.Textarea ref={userRef} autoresize />
      </Field.Root>
    ))

    const textarea = screen.getByRole('textbox', { name: 'Biography' })
    expect(userRef).toHaveBeenCalledWith(textarea)
    await waitFor(() => expect(observe).toHaveBeenCalledWith(textarea))

    result.unmount()
    observe.mockRestore()
  })
})
