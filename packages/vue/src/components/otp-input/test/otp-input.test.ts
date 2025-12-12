import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-vue'
import { page, userEvent } from 'vitest/browser'
import { nextTick } from 'vue'
import { getExports, getParts } from '../../../../../../utils/test'
import Basic from '../examples/Basic.vue'
import WithField from '../examples/WithField.vue'
import { OtpInput, otpInputAnatomy } from '../index'

async function renderOnNextTick(TestComponent: any, options?: any) {
  const view = render(TestComponent, options)

  await nextTick()

  return view
}

describe('[otp-input] component', () => {
  it.each(getParts(otpInputAnatomy))('should render part %s', async (part) => {
    render(Basic)
    expect(document.querySelector(part)).toBeInTheDocument()
  })

  it.each(getExports(otpInputAnatomy))('should export %s', async (part) => {
    expect(OtpInput[part]).toBeDefined()
  })

  it('should have the proper aria labels', async () => {
    await renderOnNextTick(Basic)
    expect(page.getByLabelText('pin code 1 of 3')).toHaveLength(1)
    expect(page.getByLabelText('pin code 2 of 3')).toHaveLength(1)
    expect(page.getByLabelText('pin code 3 of 3')).toHaveLength(1)
  })

  it('should autofocus the first input', async () => {
    await renderOnNextTick(Basic, { props: { autoFocus: true } })
    await vi.waitFor(() => expect(page.getByLabelText('pin code 1 of 3')).toHaveFocus())
  })

  it('should move focus to the next item when enter a value', async () => {
    await renderOnNextTick(Basic)

    await userEvent.type(page.getByLabelText('pin code 1 of 3'), '1')
    await vi.waitFor(() => expect(page.getByLabelText('pin code 2 of 3')).toHaveFocus())

    await userEvent.type(page.getByLabelText('pin code 2 of 3'), '2')
    await vi.waitFor(() => expect(page.getByLabelText('pin code 3 of 3')).toHaveFocus())
  })

  it('should clear the previous input when pressing backspace', async () => {
    await renderOnNextTick(Basic)

    await userEvent.type(page.getByLabelText('pin code 1 of 3'), '1')
    await userEvent.type(page.getByLabelText('pin code 2 of 3'), '2')

    await vi.waitFor(() => expect(page.getByLabelText('pin code 3 of 3')).toHaveFocus())

    await userEvent.keyboard('{Backspace}')

    await vi.waitFor(() => expect(page.getByLabelText('pin code 2 of 3')).toHaveFocus())
    expect(page.getByLabelText('pin code 2 of 3')).toHaveValue('')
  })

  it('should invoke onValueComplete when all inputs are filled out', async () => {
    const onValueComplete = vi.fn()
    await renderOnNextTick(Basic, { props: { onValueComplete } })

    await userEvent.type(page.getByLabelText('pin code 1 of 3'), '1')
    await userEvent.type(page.getByLabelText('pin code 2 of 3'), '2')
    await userEvent.type(page.getByLabelText('pin code 3 of 3'), '3')

    await vi.waitFor(() =>
      expect(onValueComplete).toHaveBeenCalledWith({
        value: ['1', '2', '3'],
        valueAsString: '123',
      }),
    )
  })

  it('should set one-time-code for autocomplete on fields', async () => {
    await renderOnNextTick(Basic, { props: { otp: true } })

    expect(page.getByLabelText('pin code 1 of 3')).toHaveAttribute('autocomplete', 'one-time-code')
    expect(page.getByLabelText('pin code 2 of 3')).toHaveAttribute('autocomplete', 'one-time-code')
    expect(page.getByLabelText('pin code 3 of 3')).toHaveAttribute('autocomplete', 'one-time-code')
  })

  it('should replace last input calls onValueComplete correctly', async () => {
    const onValueComplete = vi.fn()
    await renderOnNextTick(Basic, { props: { onValueComplete } })

    const input1 = page.getByLabelText('pin code 1 of 3')
    const input2 = page.getByLabelText('pin code 2 of 3')
    const input3 = page.getByLabelText('pin code 3 of 3')

    await userEvent.type(input1, '1')
    await userEvent.type(input2, '2')
    await userEvent.type(input3, '3')

    await vi.waitFor(() =>
      expect(onValueComplete).toHaveBeenCalledWith({
        value: ['1', '2', '3'],
        valueAsString: '123',
      }),
    )
    onValueComplete.mockClear()

    await userEvent.type(input3, '{selectall}{backspace}')
    await vi.waitFor(() => expect(input3).toHaveValue(''))

    await userEvent.type(input3, '3')
    await vi.waitFor(() =>
      expect(onValueComplete).toHaveBeenCalledWith({
        value: ['1', '2', '3'],
        valueAsString: '123',
      }),
    )
  })
})

describe('otp input Field', () => {
  it('should set input as disabled', async () => {
    await renderOnNextTick(WithField, { props: { disabled: true } })
    await expect.element(page.getByRole('textbox', { name: /pin code 1 of 3/i })).toBeDisabled()
  })

  it('should set input as readonly', async () => {
    await renderOnNextTick(WithField, { props: { readOnly: true } })
    await expect.element(page.getByRole('textbox', { name: /pin code 1 of 3/i })).toHaveAttribute('readonly')
  })

  it('should display helper text', async () => {
    await renderOnNextTick(WithField)
    expect(page.getByText('Additional Info')).toBeInTheDocument()
  })

  it('should display error text when error is present', async () => {
    await renderOnNextTick(WithField, { props: { invalid: true } })
    await expect.element(page.getByText('Error Info')).toBeInTheDocument()
  })

  it('should focus on input when label is clicked', async () => {
    await renderOnNextTick(WithField)
    await userEvent.click(page.getByText(/label/i))
    expect(page.getByRole('textbox', { name: /pin code 1 of 3/i })).toHaveFocus()
  })

  it('should not display error text when no error is present', async () => {
    await renderOnNextTick(WithField)

    expect(page.getByText('Error Info')).not.toBeInTheDocument()
  })
})
