import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { page, userEvent } from 'vitest/browser'
import { getExports, getParts } from '../../../../../../utils/test'
import { Basic } from '../examples/Basic'
import { WithField } from '../examples/WithField'
import { NumberInput, numberInputAnatomy } from '../index'

describe('[number-input] component', () => {
  it.each(getParts(numberInputAnatomy))('should render part %s', async (part) => {
    render(<Basic />)
    expect(document.querySelector(part)).toBeInTheDocument()
  })

  it.each(getExports(numberInputAnatomy))('should export %s', async (part) => {
    expect(NumberInput[part]).toBeDefined()
  })

  it('should handle wheel event when allowMouseWheel is true', async () => {
    render(<Basic allowMouseWheel />)
    const input = page.getByRole('spinbutton')
    await input.click()
    const el = input.element()
    el.dispatchEvent(
      new WheelEvent('wheel', { deltaY: -1, bubbles: true, cancelable: true }),
    )

    await vi.waitFor(async () => await expect.element(input).toHaveValue('1'))
  })

  it('should clamp value on blur when clampValueOnBlur is true', async () => {
    render(<Basic clampValueOnBlur min={0} max={10} defaultValue="15" />)
    const input = page.getByRole('spinbutton')
    await input.click()
    await userEvent.tab()

    await vi.waitFor(async () => await expect.element(input).toHaveValue('10'))
  })

  it('should allow value to exceed max when allowOverflow is true', async () => {
    render(<Basic allowOverflow max={10} defaultValue="15" />)
    const input = page.getByRole('spinbutton')
    expect(input).toHaveValue('15')
  })

  it('should handle custom format and parse functions', async () => {
    render(<Basic formatOptions={{ currency: 'USD' }} defaultValue="5" />)
    const input = page.getByRole('spinbutton')

    await vi.waitFor(async () => await expect.element(input).toHaveValue('5'))
  })

  it('should increment value by step when using increment button', async () => {
    render(<Basic step={5} defaultValue="0" />)
    const incrementBtn = page.getByText('+1')
    await userEvent.click(incrementBtn)

    const input = page.getByRole('spinbutton')
    await vi.waitFor(async () => await expect.element(input).toHaveValue('5'))
  })
})

describe('[number-input] Field', () => {
  it('should set input as required', async () => {
    render(<WithField required />)
    expect(page.getByRole('spinbutton', { name: /label/i })).toBeRequired()
  })

  it('should set input as disabled', async () => {
    render(<WithField disabled />)
    expect(page.getByRole('spinbutton', { name: /label/i })).toBeDisabled()
  })

  it('should set input as readonly', async () => {
    render(<WithField readOnly />)
    expect(page.getByRole('spinbutton', { name: /label/i })).toHaveAttribute('readonly')
  })

  it('should display helper text', async () => {
    render(<WithField />)
    expect(page.getByText('Additional Info')).toBeInTheDocument()
  })

  it('should display error text when error is present', async () => {
    render(<WithField invalid />)
    expect(page.getByText('Error Info')).toBeInTheDocument()
  })

  it('should focus on input when label is clicked', async () => {
    render(<WithField />)
    await userEvent.click(page.getByText(/label/i))
    expect(page.getByRole('spinbutton', { name: /label/i })).toHaveFocus()
  })

  it('should not display error text when no error is present', async () => {
    render(<WithField />)
    expect(page.getByText('Error Info')).not.toBeInTheDocument()
  })
})
