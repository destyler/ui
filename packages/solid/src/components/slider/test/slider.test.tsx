import { render, screen, waitFor } from '@solidjs/testing-library'
import user from '@testing-library/user-event'
import { createSignal } from 'solid-js'
import { Slider, sliderAnatomy } from '../'
import { LocaleProvider } from '../../../providers'
import { getExports, getParts } from '../../../setup-test'
import { ComponentUnderTest } from './basic'

describe('slider', () => {
  it.each(getParts(sliderAnatomy))('should render part %s', async (part) => {
    render(() => <ComponentUnderTest />)

    expect(document.querySelector(part)).toBeInTheDocument()
  })

  it.each(getExports(sliderAnatomy))('should export %s', async (part) => {
    expect(Slider[part]).toBeDefined()
  })

  it('should be possible to control it with the arrow keys', async () => {
    render(() => <ComponentUnderTest />)

    const [leftThumb, rightThumb] = screen.getAllByRole('slider', { hidden: true })

    leftThumb.focus()
    await user.keyboard('[ArrowRight]')
    expect(leftThumb).toHaveAttribute('aria-valuenow', '-19')

    await user.keyboard('[ArrowLeft]')
    expect(leftThumb).toHaveAttribute('aria-valuenow', '-20')

    rightThumb.focus()
    await user.keyboard('[ArrowRight]')
    expect(rightThumb).toHaveAttribute('aria-valuenow', '21')

    await user.keyboard('[ArrowLeft]')
    expect(rightThumb).toHaveAttribute('aria-valuenow', '20')
  })

  it('should not be possible to overlap the right thumb with the left thumb', async () => {
    render(() => <ComponentUnderTest />)

    const [leftThumb] = screen.getAllByRole('slider', { hidden: true })
    leftThumb.focus()
    await user.keyboard('[End]')
    expect(leftThumb).toHaveAttribute('aria-valuenow', '20')

    await user.keyboard('[ArrowRight]')
    expect(leftThumb).toHaveAttribute('aria-valuenow', '20')
  })

  it('should be possible to control it with the arrow keys in rtl mode', async () => {
    render(() => (
      <LocaleProvider locale="ar-AE">
        <ComponentUnderTest />
      </LocaleProvider>
    ))

    const [leftThumb, rightThumb] = screen.getAllByRole('slider', { hidden: true })

    leftThumb.focus()
    await user.keyboard('[ArrowRight]')
    expect(leftThumb).toHaveAttribute('aria-valuenow', '-21')

    await user.keyboard('[ArrowLeft]')
    expect(leftThumb).toHaveAttribute('aria-valuenow', '-20')

    rightThumb.focus()
    await user.keyboard('[ArrowRight]')
    expect(rightThumb).toHaveAttribute('aria-valuenow', '19')

    await user.keyboard('[ArrowLeft]')
    expect(rightThumb).toHaveAttribute('aria-valuenow', '20')
  })

  it('should be possible to control it with the arrow keys in vertical mode', async () => {
    render(() => <ComponentUnderTest orientation="vertical" />)

    const [leftThumb, rightThumb] = screen.getAllByRole('slider', { hidden: true })

    leftThumb.focus()
    await user.keyboard('[ArrowUp]')
    expect(leftThumb).toHaveAttribute('aria-valuenow', '-19')

    await user.keyboard('[ArrowDown]')
    expect(leftThumb).toHaveAttribute('aria-valuenow', '-20')

    rightThumb.focus()
    await user.keyboard('[ArrowUp]')
    expect(rightThumb).toHaveAttribute('aria-valuenow', '21')

    await user.keyboard('[ArrowDown]')
    expect(rightThumb).toHaveAttribute('aria-valuenow', '20')
  })

  it('should handle disabled state', async () => {
    render(() => <ComponentUnderTest disabled />)
    const [leftThumb, rightThumb] = screen.getAllByRole('slider', { hidden: true })
    expect(leftThumb).toHaveAttribute('aria-disabled', 'true')
    expect(rightThumb).toHaveAttribute('aria-disabled', 'true')
  })

  it('should emit correct onValueChange events', async () => {
    const onValueChange = vi.fn()
    render(() => <ComponentUnderTest onValueChange={onValueChange} />)
    const [leftThumb] = screen.getAllByRole('slider', { hidden: true })

    leftThumb.focus()
    await user.keyboard('[ArrowRight]')

    await waitFor(() => expect(onValueChange).toHaveBeenCalledTimes(1))
  })

  it('separates range values with a comma and space', () => {
    render(() => <ComponentUnderTest />)

    expect(document.querySelector('[data-part="value-text"]')).toHaveTextContent('-20, 20')
  })

  it('preserves falsy custom ValueText children', () => {
    render(() => (
      <Slider.Root defaultValue={[5, 10]}>
        <Slider.ValueText data-testid="slider-value-text">{0}</Slider.ValueText>
      </Slider.Root>
    ))

    expect(screen.getByTestId('slider-value-text')).toHaveTextContent('0')
    expect(screen.getByTestId('slider-value-text')).not.toHaveTextContent('5, 10')
  })

  it('updates hidden input props when the slider context changes', async () => {
    const [name, setName] = createSignal('initial-volume')
    render(() => <ComponentUnderTest name={name()} />)

    const [leftThumb] = screen.getAllByRole('slider', { hidden: true })
    const [leftInput] = document.querySelectorAll<HTMLInputElement>(
      'input[type="text"][hidden]',
    )
    expect(leftInput).toHaveValue('-20')
    expect(leftInput).toHaveAttribute('name', 'initial-volume[]')

    setName('updated-volume')
    await waitFor(() => expect(leftInput).toHaveAttribute('name', 'updated-volume[]'))

    leftThumb.focus()
    await user.keyboard('[ArrowRight]')

    await waitFor(() => expect(leftInput).toHaveValue('-19'))
  })
})
