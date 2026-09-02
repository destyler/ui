import { render, screen, waitFor } from '@solidjs/testing-library'
import user from '@testing-library/user-event'
import { createSignal } from 'solid-js'
import { ColorPicker, colorPickerAnatomy, parseColor } from '../'
import { getExports, getParts } from '../../../setup-test'
import { WithField } from '../examples/WithField'
import { ComponentUnderTest } from './basic'

describe('colorPicker', () => {
  it.each(getParts(colorPickerAnatomy))('should render part %s', async (part) => {
    render(() => <ComponentUnderTest />)

    expect(document.querySelector(part)).toBeInTheDocument()
  })

  it.each(getExports(colorPickerAnatomy))('should export %s', async (part) => {
    expect(ColorPicker[part]).toBeDefined()
  })

  it('should be able to lazy mount', async () => {
    render(() => <ComponentUnderTest lazyMount />)

    expect(screen.queryByTestId('positioner')).not.toBeInTheDocument()

    await user.click(screen.getByTestId('trigger'))
    expect(screen.getByTestId('positioner')).toBeInTheDocument()

    await user.click(screen.getByTestId('trigger'))
    await waitFor(() => {
      expect(screen.queryByTestId('positioner')).toBeInTheDocument()
    })
  })

  it('should lazy mount and unmount on exit', async () => {
    render(() => <ComponentUnderTest lazyMount unmountOnExit />)

    expect(screen.queryByTestId('positioner')).not.toBeInTheDocument()

    await user.click(screen.getByTestId('trigger'))
    expect(screen.getByTestId('positioner')).toBeInTheDocument()

    await user.click(screen.getByTestId('trigger'))
    await waitFor(() => {
      expect(screen.queryByTestId('positioner')).not.toBeInTheDocument()
    })
  })

  it('updates channel and hidden inputs when readOnly changes', async () => {
    const [readOnly, setReadOnly] = createSignal(false)
    render(() => (
      <>
        <button type="button" onClick={() => setReadOnly(value => !value)}>
          Toggle readonly
        </button>
        <ColorPicker.Root value={parseColor('#eb5e41')} readOnly={readOnly()}>
          <ColorPicker.ChannelInput channel="hex" data-testid="channel-input" />
          <ColorPicker.HiddenInput data-testid="hidden-input" />
        </ColorPicker.Root>
      </>
    ))

    const channelInput = screen.getByTestId('channel-input')
    const hiddenInput = screen.getByTestId('hidden-input')
    expect(channelInput).not.toHaveAttribute('readonly')
    expect(hiddenInput).not.toHaveAttribute('readonly')

    await user.click(screen.getByRole('button', { name: 'Toggle readonly' }))
    await waitFor(() => expect(channelInput).toHaveAttribute('readonly'))
    expect(hiddenInput).toHaveAttribute('readonly')

    await user.click(screen.getByRole('button', { name: 'Toggle readonly' }))
    await waitFor(() => expect(channelInput).not.toHaveAttribute('readonly'))
    expect(hiddenInput).not.toHaveAttribute('readonly')
  })

  it('prefers custom children in ValueText', () => {
    render(() => (
      <ColorPicker.Root value={parseColor('#eb5e41')}>
        <ColorPicker.ValueText>Custom color</ColorPicker.ValueText>
      </ColorPicker.Root>
    ))

    expect(screen.getByText('Custom color')).toBeInTheDocument()
  })

  it('renders ChannelSliderValueText as a span', () => {
    let valueText: HTMLSpanElement | undefined

    render(() => (
      <ColorPicker.Root value={parseColor('#eb5e41')}>
        <ColorPicker.ChannelSlider channel="alpha">
          <ColorPicker.ChannelSliderValueText
            ref={(element) => {
              // @ts-expect-error -- ChannelSliderValueText exposes a span ref, not div-only properties.
              void element.align
              valueText = element
            }}
          />
        </ColorPicker.ChannelSlider>
      </ColorPicker.Root>
    ))

    expect(valueText).toBeInstanceOf(HTMLSpanElement)
    expect(valueText?.tagName).toBe('SPAN')
  })

  it('preserves falsy custom ChannelSliderValueText children', () => {
    render(() => (
      <ColorPicker.Root value={parseColor('#eb5e41')}>
        <ColorPicker.ChannelSlider channel="alpha">
          <ColorPicker.ChannelSliderValueText data-testid="channel-value-text">
            {0}
          </ColorPicker.ChannelSliderValueText>
        </ColorPicker.ChannelSlider>
      </ColorPicker.Root>
    ))

    expect(screen.getByTestId('channel-value-text')).toHaveTextContent('0')
    expect(screen.getByTestId('channel-value-text')).not.toHaveTextContent('100%')
  })

  it('keeps ValueSwatch props and indicator in sync', async () => {
    const initialValue = parseColor('#eb5e41')
    const nextValue = parseColor('#2563eb')
    const [value, setValue] = createSignal(initialValue)
    const [respectAlpha, setRespectAlpha] = createSignal(false)

    render(() => (
      <ColorPicker.Root value={value()}>
        <ColorPicker.ValueSwatch
          respectAlpha={respectAlpha()}
          data-testid="value-swatch"
        >
          <ColorPicker.SwatchIndicator data-testid="value-swatch-indicator" />
        </ColorPicker.ValueSwatch>
      </ColorPicker.Root>
    ))

    const swatch = screen.getByTestId('value-swatch')
    const indicator = screen.getByTestId('value-swatch-indicator')
    expect(swatch.style.getPropertyValue('--color')).toBe(initialValue.toString('hex'))
    expect(indicator).not.toHaveAttribute('hidden')

    setValue(nextValue)
    setRespectAlpha(true)

    await waitFor(() =>
      expect(swatch.style.getPropertyValue('--color')).toBe(nextValue.toString('css')),
    )
    expect(indicator).not.toHaveAttribute('hidden')
  })
})

describe('color Picker / Field', () => {
  it('should set color picker as required', async () => {
    render(() => <WithField required />)
    expect(screen.getByRole('textbox', { name: /label/i })).toBeRequired()
  })

  it('should set color picker as disabled', async () => {
    render(() => <WithField disabled />)
    expect(screen.getByRole('textbox', { name: /label/i })).toBeDisabled()
  })

  it('should set color picker as readonly', async () => {
    render(() => <WithField readOnly />)
    expect(screen.getByRole('textbox', { name: /label/i })).toHaveAttribute('readonly')
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
    expect(screen.getByRole('textbox', { name: /hex/i })).toHaveFocus()
  })

  it('should not display error text when no error is present', async () => {
    render(() => <WithField />)
    expect(screen.queryByText('Error Info')).not.toBeInTheDocument()
  })
})
