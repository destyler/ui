import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import { page, userEvent } from 'vitest/browser'
import { Field, fieldAnatomy } from '~/index'
import { getExports, getParts } from '../../../../../../utils/test'
import Basic from '../examples/Basic.vue'
import Disabled from '../examples/Disabled.vue'

describe('[field] component', () => {
  it.each(getParts(fieldAnatomy))('should render part %s', async (part) => {
    render(Basic)
    expect(document.querySelector(part)).toBeInTheDocument()
  })

  it.each(getExports(fieldAnatomy))('should export %s', async (part) => {
    expect(Field[part]).toBeDefined()
  })

  it('should set textbox as required', async () => {
    render(Basic, { props: { required: true } })
    await expect.element(page.getByRole('textbox', { name: /label/i })).toBeRequired()
    await expect.element(page.getByText('*')).toBeInTheDocument()
  })

  it('should set textbox as disabled', async () => {
    render(Disabled)
    await expect.element(page.getByRole('textbox', { name: /label/i })).toBeDisabled()
    await expect.element(page.getByTestId('root')).toHaveAttribute('data-disabled')
    await expect.element(page.getByText('Label')).toHaveAttribute('data-disabled')
    await expect.element(page.getByText('Some additional Info')).toHaveAttribute('data-disabled')
  })

  it('should set textbox as readonly', async () => {
    render(Basic, { props: { readOnly: true } })
    await expect.element(page.getByRole('textbox', { name: /label/i })).toHaveAttribute('readonly')
  })

  it('should display helper text', async () => {
    render(Basic)
    await expect.element(page.getByText('Some additional Info')).toBeInTheDocument()
  })

  it('should display error text when error is present', async () => {
    render(Basic, { props: { invalid: true } })
    await expect.element(page.getByText('Error Info')).toBeInTheDocument()
  })

  it('should focus on input when label is clicked', async () => {
    render(Basic)
    await userEvent.click(page.getByText(/label/i))
    await expect.element(page.getByRole('textbox', { name: /label/i })).toHaveFocus()
  })

  it('should not display error text when no error is present', async () => {
    render(Basic, { props: { invalid: false } })
    await expect.element(page.getByText('Error Info')).not.toBeInTheDocument()
  })

  it('should allow input to be controlled', async () => {
    render(Basic, { props: { modelValue: 'Input is controlled' } })

    await expect.element(page.getByRole('textbox', { name: /label/i })).toHaveValue('Input is controlled')
  })
})
