import { fireEvent, render, screen, waitFor } from '@solidjs/testing-library'
import user from '@testing-library/user-event'
import { createSignal } from 'solid-js'
import { NumberInput, numberInputAnatomy } from '../'
import { getExports, getParts } from '../../../setup-test'
import { WithField } from '../examples/WithField'
import { ComponentUnderTest } from './basic'

describe('numberInput', () => {
  it.each(getParts(numberInputAnatomy))('should render part! %s', async (part) => {
    render(() => <ComponentUnderTest />)

    expect(document.querySelector(part)).toBeInTheDocument()
  })

  it.each(getExports(numberInputAnatomy))('should export %s', async (part) => {
    expect(NumberInput[part]).toBeDefined()
  })

  it('should handle wheel event when allowMouseWheel is true', async () => {
    render(() => <ComponentUnderTest allowMouseWheel />)
    const input = screen.getByRole('spinbutton')
    input.focus()
    fireEvent.wheel(input, { deltaY: -1 })

    await waitFor(() => {
      expect(input).toHaveValue('1')
    })
  })

  it('should clamp value on blur when clampValueOnBlur is true', async () => {
    render(() => <ComponentUnderTest clampValueOnBlur min={0} max={10} value="15" />)
    const input = screen.getByRole('spinbutton')
    input.focus()
    input.blur()

    await waitFor(() => {
      expect(input).toHaveValue('10')
    })
  })

  it('should allow value to exceed max when allowOverflow is true', async () => {
    render(() => <ComponentUnderTest allowOverflow max={10} value="15" />)
    const input = screen.getByRole('spinbutton')
    expect(input).toHaveValue('15')
  })

  it('should handle custom format and parse functions', async () => {
    render(() => (
      <ComponentUnderTest
        formatOptions={{
          currency: 'USD',
        }}
        value="5"
      />
    ))
    const input = screen.getByRole('spinbutton')

    await waitFor(() => {
      expect(input).toHaveValue('5')
    })
  })

  it('should increment value by step when using increment button', async () => {
    render(() => <ComponentUnderTest step={5} value="0" />)
    const incrementBtn = screen.getByText('+1')
    await user.click(incrementBtn)

    const input = screen.getByRole('spinbutton')
    await waitFor(() => {
      expect(input).toHaveValue('5')
    })
  })

  it('renders the current value in ValueText by default', async () => {
    render(() => <ComponentUnderTest defaultValue="5" />)

    const valueText = document.querySelector('[data-part="value-text"]')
    expect(valueText).toHaveTextContent('5')

    await user.click(screen.getByText('+1'))
    await waitFor(() => expect(valueText).toHaveTextContent('6'))
  })

  it('preserves falsy custom ValueText children', () => {
    render(() => (
      <NumberInput.Root defaultValue="5">
        <NumberInput.ValueText data-testid="value-text">{0}</NumberInput.ValueText>
      </NumberInput.Root>
    ))

    expect(screen.getByTestId('value-text')).toHaveTextContent('0')
    expect(screen.getByTestId('value-text')).not.toHaveTextContent('5')
  })

  it('should update the input when readOnly changes', async () => {
    const [readOnly, setReadOnly] = createSignal(false)
    render(() => (
      <>
        <ComponentUnderTest readOnly={readOnly()} />
        <button type="button" onClick={() => setReadOnly(true)}>
          make readonly
        </button>
      </>
    ))

    const input = screen.getByRole('spinbutton')
    expect(input).not.toHaveAttribute('readonly')

    await user.click(screen.getByRole('button', { name: 'make readonly' }))

    await waitFor(() => expect(input).toHaveAttribute('readonly'))
  })

  it.skip('should handle min and max fraction digits', async () => {
    render(() => (
      <ComponentUnderTest
        value="1.00"
        formatOptions={{ minimumFractionDigits: 2, maximumFractionDigits: 3 }}
      />
    ))
    const input = screen.getByRole('spinbutton')
    await waitFor(() => {
      expect(input).toHaveValue('1.00')
    })
    await user.clear(input)
    await user.type(input, '1.1234')
    input.blur()

    await waitFor(() => {
      expect(input).toHaveValue('1.123')
    })
  })
})

describe('numberInput / Field', () => {
  it('should set input as required', async () => {
    render(() => <WithField required />)
    expect(screen.getByRole('spinbutton', { name: /label/i })).toBeRequired()
  })

  it('should set input as disabled', async () => {
    render(() => <WithField disabled />)
    expect(screen.getByRole('spinbutton', { name: /label/i })).toBeDisabled()
  })

  it('should set input as readonly', async () => {
    render(() => <WithField readOnly />)
    expect(screen.getByRole('spinbutton', { name: /label/i })).toHaveAttribute('readonly')
  })

  it('should display helper text', async () => {
    render(() => <WithField />)
    expect(screen.getByText('Additional Info')).toBeInTheDocument()
  })

  it('should display error text when error is present', async () => {
    render(() => <WithField invalid />)
    expect(screen.getByText('Error Info')).toBeInTheDocument()
  })

  it('should focus on input when label is clicked', async () => {
    render(() => <WithField />)
    await user.click(screen.getByText(/label/i))
    expect(screen.getByRole('spinbutton', { name: /label/i })).toHaveFocus()
  })

  it('should not display error text when no error is present', async () => {
    render(() => <WithField />)
    expect(screen.queryByText('Error Info')).not.toBeInTheDocument()
  })
})
