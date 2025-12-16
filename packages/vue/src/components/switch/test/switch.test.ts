import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import { page, userEvent } from 'vitest/browser'
import { getExports, getParts } from '../../../../../../utils/test'
import Basic from '../examples/Basic.vue'
import WithField from '../examples/WithField.vue'
import { Switch, switchAnatomy } from '../index'

describe('[switch] component', () => {
  it.each(getParts(switchAnatomy))('should render part %s', async (part) => {
    render(Basic)
    expect(document.querySelector(part)).toBeInTheDocument()
  })

  it.each(getExports(switchAnatomy))('should export %s', async (part) => {
    expect(Switch[part]).toBeDefined()
  })

  it('should show invalid attribute when invalid', async () => {
    render(Basic, { props: { invalid: true } })
    const switchControl = page.getByRole('checkbox')

    await expect.element(switchControl).toHaveAttribute('aria-invalid', 'true')
  })

  it('should be required when required is true', async () => {
    render(Basic, { props: { required: true } })
    const switchControl = page.getByRole('checkbox')

    await expect.element(switchControl).toBeRequired()
  })
})

describe('switch / Field', () => {
  it('should set switch as required', async () => {
    render(WithField, { props: { required: true } })
    await expect.element(page.getByRole('checkbox', { name: /label/i })).toBeRequired()
  })

  it('should set switch as disabled', async () => {
    render(WithField, { props: { disabled: true } })
    await expect.element(page.getByRole('checkbox', { name: /label/i })).toBeDisabled()
  })

  it('should display helper text', async () => {
    render(WithField)
    await expect.element(page.getByText('Additional Info')).toBeInTheDocument()
  })

  it('should display error text when error is present', async () => {
    render(WithField, { props: { invalid: true } })
    await expect.element(page.getByText('Error Info')).toBeInTheDocument()
  })

  it('should focus on switch when label is clicked', async () => {
    render(WithField)
    await userEvent.click(page.getByText(/label/i))
    await expect.element(page.getByRole('checkbox', { name: /label/i })).toHaveFocus()
  })

  it('should not display error text when no error is present', async () => {
    render(WithField)
    await expect.element(page.getByText('Error Info')).not.toBeInTheDocument()
  })
})
