import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-svelte'
import { userEvent } from 'vitest/browser'
import Basic from '../examples/Basic.svelte'
import Formatted from '../examples/Formatted.svelte'
import FormUsage from '../examples/FormUsage.svelte'
import FractionDigits from '../examples/FractionDigits.svelte'
import MinMax from '../examples/MinMax.svelte'
import MouseWheel from '../examples/MouseWheel.svelte'
import NoClamp from '../examples/NoClamp.svelte'
import RenderFn from '../examples/RenderFn.svelte'
import RootProvider from '../examples/RootProvider.svelte'
import Scrubber from '../examples/Scrubber.svelte'
import WithField from '../examples/WithField.svelte'
import { NumberInput, numberInputAnatomy } from '../index'

const componentExports = NumberInput as unknown as Record<string, unknown>

describe('[number-input] component', () => {
  it.each(numberInputAnatomy.keys())('renders part %s', async (part) => {
    await render(Basic)
    const dataPart = part.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)
    expect(document.querySelector(`[data-scope="number-input"][data-part="${dataPart}"]`)).not.toBeNull()
  })

  it.each(numberInputAnatomy.keys())('exports %s', (part) => {
    const exportName = `${part.charAt(0).toUpperCase()}${part.slice(1)}`
    expect(componentExports[exportName], `NumberInput.${exportName}`).toBeDefined()
  })

  it('increments by the configured step', async () => {
    const onValueChange = vi.fn()
    const screen = await render(Basic, { props: { step: 5, defaultValue: '0', onValueChange } })
    await screen.getByText('+1').click()
    await expect.element(screen.getByRole('spinbutton')).toHaveValue('5')
    expect(onValueChange).toHaveBeenCalled()
  })

  it('changes value with the mouse wheel when enabled', async () => {
    const screen = await render(Basic, { props: { allowMouseWheel: true } })
    const input = screen.getByRole('spinbutton')
    await input.click()
    input.element().dispatchEvent(new WheelEvent('wheel', { deltaY: -1, bubbles: true, cancelable: true }))
    await vi.waitFor(async () => await expect.element(input).toHaveValue('1'))
  })

  it('clamps an overflowing value on blur', async () => {
    const screen = await render(Basic, {
      props: { clampValueOnBlur: true, min: 0, max: 10, defaultValue: '15' },
    })
    const input = screen.getByRole('spinbutton')
    await input.click()
    await userEvent.tab()
    await vi.waitFor(async () => await expect.element(input).toHaveValue('10'))
  })

  it('allows overflow when requested', async () => {
    const screen = await render(Basic, { props: { allowOverflow: true, max: 10, defaultValue: '15' } })
    await expect.element(screen.getByRole('spinbutton')).toHaveValue('15')
  })

  it('formats values with the configured number-format options', async () => {
    const screen = await render(Basic, {
      props: {
        formatOptions: { style: 'currency', currency: 'USD' },
        defaultValue: '5',
      },
    })
    const input = screen.getByRole('spinbutton')

    await expect.element(input).toHaveValue('$5.00')
    expect(document.querySelector('[data-part="value-text"]')).toHaveTextContent('$5.00')

    await screen.getByText('+1').click()
    await expect.element(input).toHaveValue('$6.00')
    expect(document.querySelector('[data-part="value-text"]')).toHaveTextContent('$6.00')
  })

  it('renders the formatted variant', async () => {
    const formatted = await render(Formatted)
    await expect.element(formatted.getByRole('spinbutton')).toBeVisible()
  })

  it('preserves configured fraction digits', async () => {
    const fraction = await render(FractionDigits)
    await expect.element(fraction.getByRole('spinbutton')).toHaveValue('1.00')
  })

  it('sets the form field name', async () => {
    const form = await render(FormUsage)
    await expect.element(form.getByRole('spinbutton')).toHaveAttribute('name', 'quantity')
  })

  it('sets min and max attributes', async () => {
    const minMax = await render(MinMax)
    await expect.element(minMax.getByRole('spinbutton')).toHaveAttribute('aria-valuemin', '0')
    await expect.element(minMax.getByRole('spinbutton')).toHaveAttribute('aria-valuemax', '10')
  })

  it('renders the mouse-wheel variant', async () => {
    const wheel = await render(MouseWheel)
    await expect.element(wheel.getByRole('spinbutton')).toBeVisible()
  })

  it('renders the no-clamp variant', async () => {
    const noClamp = await render(NoClamp)
    await expect.element(noClamp.getByRole('spinbutton')).toBeVisible()
  })

  it('renders the scrubber variant', async () => {
    await render(Scrubber)
    expect(document.querySelector('[data-part="scrubber"]')?.tagName).toBe('DIV')
  })

  it('updates the render context', async () => {
    const screen = await render(RenderFn)
    await screen.getByText('+1').click()
    await expect.element(screen.getByText('Label 1')).toBeVisible()
  })

  it('focuses the input through RootProvider', async () => {
    const screen = await render(RootProvider)
    await screen.getByRole('button', { name: 'Focus' }).click()
    await expect.element(screen.getByRole('spinbutton')).toHaveFocus()
  })
})

describe('[number-input] field integration', () => {
  it('inherits required state', async () => {
    const screen = await render(WithField, { props: { required: true } })
    await expect.element(screen.getByRole('spinbutton', { name: /label/i })).toBeRequired()
  })

  it('inherits disabled state', async () => {
    const screen = await render(WithField, { props: { disabled: true } })
    await expect.element(screen.getByRole('spinbutton', { name: /label/i })).toBeDisabled()
  })

  it('inherits readonly state', async () => {
    const screen = await render(WithField, { props: { readOnly: true } })
    await expect.element(screen.getByRole('spinbutton', { name: /label/i })).toHaveAttribute('readonly')
  })

  it('renders helper and conditional error text', async () => {
    const screen = await render(WithField, { props: { invalid: true } })
    await expect.element(screen.getByText('Additional Info')).toBeVisible()
    await expect.element(screen.getByText('Error Info')).toBeVisible()
  })

  it('focuses the input when its label is clicked', async () => {
    const screen = await render(WithField)
    await screen.getByText('Label').click()
    await expect.element(screen.getByRole('spinbutton', { name: /label/i })).toHaveFocus()
  })

  it('hides error text when valid', async () => {
    const screen = await render(WithField)
    await expect.element(screen.getByText('Error Info')).not.toBeInTheDocument()
  })
})
