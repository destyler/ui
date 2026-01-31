import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { page, userEvent } from 'vitest/browser'
import { getExports, getParts } from '../../../../../../utils/test'
import { AllParts } from '../examples/AllParts'
import { Basic } from '../examples/Basic'
import { Disabled } from '../examples/Disabled'
import { Field, fieldAnatomy } from '../index'

describe('[field] component', () => {
  it.each(getParts(fieldAnatomy))('should render part %s', (part) => {
    render(<AllParts />)
    expect(document.querySelector(part)).toBeInTheDocument()
  })

  it.each(getExports(fieldAnatomy))('should export %s', (part) => {
    render(<Basic />)
    expect(Field[part]).toBeDefined()
  })

  it('should set textbox as required', async () => {
    render(<Basic required />)
    await expect.element(page.getByRole('textbox', { name: /label/i })).toBeRequired()
    await expect.element(page.getByText('*')).toBeInTheDocument()
  })

  it('should set textbox as disabled', async () => {
    render(<Disabled />)
    await expect.element(page.getByRole('textbox', { name: /label/i })).toBeDisabled()
    await expect.element(page.getByTestId('root')).toHaveAttribute('data-disabled')
    await expect.element(page.getByText('Label')).toHaveAttribute('data-disabled')
    await expect.element(page.getByText('Some additional Info')).toHaveAttribute('data-disabled')
  })

  it('should set textbox as readonly', async () => {
    render(<Basic readOnly />)
    await expect.element(page.getByRole('textbox', { name: /label/i })).toHaveAttribute('readonly')
  })

  it('should display helper text', async () => {
    render(<Basic />)
    await expect.element(page.getByText('Some additional Info')).toBeInTheDocument()
  })

  it('should display error text when error is present', async () => {
    render(<Basic invalid />)
    await expect.element(page.getByText('Error Info')).toBeInTheDocument()
  })

  it('should focus on input when label is clicked', async () => {
    render(<Basic />)
    await userEvent.click(page.getByText(/label/i))
    await expect.element(page.getByRole('textbox', { name: /label/i })).toHaveFocus()
  })

  it('should not display error text when no error is present', async () => {
    render(<Basic invalid={false} />)
    await expect.element(page.getByText('Error Info')).not.toBeInTheDocument()
  })
})
