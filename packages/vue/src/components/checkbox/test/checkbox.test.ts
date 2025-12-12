import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-vue'
import { page, userEvent } from 'vitest/browser'
import { getExports, getParts } from '../../../../../../utils/test'
import Basic from '../examples/Basic.vue'
import Controlled from '../examples/Controlled.vue'
import Group from '../examples/Group.vue'
import Indeterminate from '../examples/Indeterminate.vue'
import WithField from '../examples/WithField.vue'
import { Checkbox, checkboxAnatomy } from '../index'

describe('[checkbox] component', () => {
  it.each(getParts(checkboxAnatomy).filter(p => !p.includes('group')))('should render part %s', async (part) => {
    render(Basic)

    expect(document.querySelector(part)).toBeInTheDocument()
  })

  it('should render part [data-scope="checkbox"][data-part="group"]', async () => {
    render(Group)

    expect(document.querySelector('[data-scope="checkbox"][data-part="group"]')).toBeInTheDocument()
  })

  it.each(getExports(checkboxAnatomy))('should export %s', async (part) => {
    render(Basic)
    expect(Checkbox[part]).toBeDefined()
  })

  it('should handle check and unchecked', async () => {
    const onCheckedChange = vi.fn()
    render(Basic, { props: { onCheckedChange } })

    const checkbox = page.getByRole('checkbox')
    const label = page.getByText('Checkbox')

    await userEvent.click(label)
    await expect.element(checkbox).toBeChecked()
  })

  it('should allow controlled usage', async () => {
    render(Controlled)

    await expect.element(page.getByRole('checkbox').first()).toBeChecked()
  })

  it('should handle indeterminate state from example', async () => {
    render(Indeterminate)
    await expect.element(page.getByTestId('control')).toHaveAttribute('data-state', 'indeterminate')
  })
})

describe('checkbox / Field', () => {
  it('should set checkbox as required', async () => {
    render(WithField, { props: { required: true } })
    await expect.element(page.getByRole('checkbox', { name: /label/i })).toBeRequired()
  })

  it('should set input as disabled', async () => {
    render(WithField, { props: { disabled: true } })
    await expect.element(page.getByRole('checkbox', { name: /label/i })).toBeDisabled()
  })

  it('should set input as readonly', async () => {
    render(WithField, { props: { readOnly: true } })
    await expect.element(page.getByText('Label')).toHaveAttribute('data-readonly')
  })

  it('should display helper text', async () => {
    render(WithField)
    await expect.element(page.getByText('Additional Info')).toBeInTheDocument()
  })

  it('should display error text when error is present', async () => {
    render(WithField, { props: { invalid: true } })
    await expect.element(page.getByText('Error Info')).toBeInTheDocument()
  })

  it('should focus on input when label is clicked', async () => {
    render(WithField)
    await userEvent.click(page.getByText(/label/i))
    await expect.element(page.getByRole('checkbox', { name: /label/i })).toHaveFocus()
  })

  it('should not display error text when no error is present', async () => {
    render(WithField)
    await expect.element(page.getByText('Error Info')).not.toBeInTheDocument()
  })
})
