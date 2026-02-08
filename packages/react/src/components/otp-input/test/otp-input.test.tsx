import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { page, userEvent } from 'vitest/browser'
import { getExports, getParts } from '../../../../../../utils/test'
import { Basic } from '../examples/Basic'
import { WithField } from '../examples/WithField'
import { OtpInput, otpInputAnatomy } from '../index'

describe('[otp-input] component', () => {
  it.each(getParts(otpInputAnatomy))('should render part %s', async (part) => {
    render(<Basic />)
    expect(document.querySelector(part)).toBeInTheDocument()
  })

  it.each(getExports(otpInputAnatomy))('should export %s', async (part) => {
    expect(OtpInput[part]).toBeDefined()
  })

  it('should have the proper aria labels', async () => {
    render(<Basic />)
    expect(page.getByLabelText('pin code 1 of 3')).toHaveLength(1)
    expect(page.getByLabelText('pin code 2 of 3')).toHaveLength(1)
    expect(page.getByLabelText('pin code 3 of 3')).toHaveLength(1)
  })

  it('should autofocus the first input', async () => {
    render(
      <OtpInput.Root autoFocus>
        <OtpInput.Label>Label</OtpInput.Label>
        <OtpInput.Control>
          <OtpInput.Input index={0} />
          <OtpInput.Input index={1} />
          <OtpInput.Input index={2} />
        </OtpInput.Control>
      </OtpInput.Root>,
    )
    await vi.waitFor(() => expect(page.getByLabelText('pin code 1 of 3')).toHaveFocus())
  })

  it('should move focus to the next item when enter a value', async () => {
    render(<Basic />)

    await userEvent.type(page.getByLabelText('pin code 1 of 3'), '1')
    await vi.waitFor(() => expect(page.getByLabelText('pin code 2 of 3')).toHaveFocus())

    await userEvent.type(page.getByLabelText('pin code 2 of 3'), '2')
    await vi.waitFor(() => expect(page.getByLabelText('pin code 3 of 3')).toHaveFocus())
  })

  it('should clear the previous input when pressing backspace', async () => {
    render(<Basic />)

    await userEvent.type(page.getByLabelText('pin code 1 of 3'), '1')
    await userEvent.type(page.getByLabelText('pin code 2 of 3'), '2')

    await vi.waitFor(() => expect(page.getByLabelText('pin code 3 of 3')).toHaveFocus())

    await userEvent.keyboard('{Backspace}')

    await vi.waitFor(() => expect(page.getByLabelText('pin code 2 of 3')).toHaveFocus())
    expect(page.getByLabelText('pin code 2 of 3')).toHaveValue('')
  })

  it('should invoke onValueComplete when all inputs are filled out', async () => {
    const onValueComplete = vi.fn()
    render(
      <OtpInput.Root onValueComplete={onValueComplete}>
        <OtpInput.Label>Label</OtpInput.Label>
        <OtpInput.Control>
          <OtpInput.Input index={0} />
          <OtpInput.Input index={1} />
          <OtpInput.Input index={2} />
        </OtpInput.Control>
      </OtpInput.Root>,
    )

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
    render(
      <OtpInput.Root otp>
        <OtpInput.Label>Label</OtpInput.Label>
        <OtpInput.Control>
          <OtpInput.Input index={0} />
          <OtpInput.Input index={1} />
          <OtpInput.Input index={2} />
        </OtpInput.Control>
      </OtpInput.Root>,
    )

    expect(page.getByLabelText('pin code 1 of 3')).toHaveAttribute('autocomplete', 'one-time-code')
    expect(page.getByLabelText('pin code 2 of 3')).toHaveAttribute('autocomplete', 'one-time-code')
    expect(page.getByLabelText('pin code 3 of 3')).toHaveAttribute('autocomplete', 'one-time-code')
  })

  it('should replace last input calls onValueComplete correctly', async () => {
    const onValueComplete = vi.fn()
    render(
      <OtpInput.Root onValueComplete={onValueComplete}>
        <OtpInput.Label>Label</OtpInput.Label>
        <OtpInput.Control>
          <OtpInput.Input index={0} />
          <OtpInput.Input index={1} />
          <OtpInput.Input index={2} />
        </OtpInput.Control>
      </OtpInput.Root>,
    )

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

    // Clear the last input using triple-click to select all, then backspace
    await userEvent.tripleClick(input3)
    await userEvent.keyboard('{Backspace}')
    await vi.waitFor(() => expect(input3).toHaveValue(''))

    // Type a different value first, then the same value to trigger onValueComplete
    await userEvent.type(input3, '4')
    await vi.waitFor(() => expect(input3).toHaveValue('4'))

    // Clear again and type the original value
    await userEvent.tripleClick(input3)
    await userEvent.keyboard('{Backspace}')
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
    render(<WithField disabled />)
    await expect.element(page.getByRole('textbox', { name: /pin code 1 of 3/i })).toBeDisabled()
  })

  it('should set input as readonly', async () => {
    render(<WithField readOnly />)
    await expect.element(page.getByRole('textbox', { name: /pin code 1 of 3/i })).toHaveAttribute('readonly')
  })

  it('should display helper text', async () => {
    render(<WithField />)
    expect(page.getByText('Additional Info')).toBeInTheDocument()
  })

  it('should display error text when error is present', async () => {
    render(<WithField invalid />)
    await expect.element(page.getByText('Error Info')).toBeInTheDocument()
  })

  it('should focus on input when label is clicked', async () => {
    render(<WithField />)
    await userEvent.click(page.getByText(/label/i))
    expect(page.getByRole('textbox', { name: /pin code 1 of 3/i })).toHaveFocus()
  })

  it('should not display error text when no error is present', async () => {
    render(<WithField />)

    expect(page.getByText('Error Info')).not.toBeInTheDocument()
  })
})
