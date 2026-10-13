import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { page, userEvent } from 'vitest/browser'
import { getExports, getParts } from '../../../../../../utils/test'
import { Basic } from '../examples/Basic'
import { WithField } from '../examples/WithField'
import { ColorPicker, colorPickerAnatomy, parseColor } from '../index'

describe('[color-picker] component', () => {
  it.each(getParts(colorPickerAnatomy))('should render part %s', async (part) => {
    await render(<Basic />)
    expect(document.querySelector(part)).toBeInTheDocument()
  })

  it.each(getExports(colorPickerAnatomy))('should export %s', async (part) => {
    expect(ColorPicker).toHaveProperty(part, expect.anything())
  })

  it('should be able to lazy mount', async () => {
    await render(<Basic lazyMount />)

    await expect.element(page.getByTestId('positioner')).not.toBeInTheDocument()

    await userEvent.click(page.getByTestId('trigger'))
    await expect.element(page.getByTestId('positioner')).toBeInTheDocument()

    await userEvent.click(page.getByTestId('trigger'))
    await expect.element(page.getByTestId('positioner')).toBeInTheDocument()
  }, 7000)

  it('should render with default value', async () => {
    await render(<Basic defaultValue={parseColor('#ff00ff')} />)

    await expect.element(page.getByTestId('swatch-trigger')).toHaveStyle({
      backgroundColor: 'rgb(255, 0, 255)',
    })
  })
})

describe('color Picker / Field', () => {
  it('should set color picker as required', async () => {
    await render(<WithField required />)
    await expect.element(page.getByRole('textbox', { name: /label/i })).toBeRequired()
  })

  it('should set color picker as disabled', async () => {
    await render(<WithField disabled />)
    await expect.element(page.getByRole('textbox', { name: /label/i })).toBeDisabled()
  })

  it('should set color picker as readonly', async () => {
    await render(<WithField readOnly />)
    await expect.element(page.getByRole('textbox', { name: /label/i })).toHaveAttribute('readonly')
  })

  it('should display helper text', async () => {
    await render(<WithField />)
    await expect.element(page.getByText('Additional Info')).toBeInTheDocument()
  })

  it('should display error text when error is present', async () => {
    await render(<WithField invalid />)
    await expect.element(page.getByText('Error Info')).toBeInTheDocument()
  })

  it('should focus on input when label is clicked', async () => {
    await render(<WithField />)
    await userEvent.click(page.getByText(/label/i))
    await expect.element(page.getByRole('textbox', { name: /hex/i })).toHaveFocus()
  })

  it('should not display error text when no error is present', async () => {
    await render(<WithField />)
    await expect.element(page.getByTestId('Error Info')).not.toBeInTheDocument()
  })
})
