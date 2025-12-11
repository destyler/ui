import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import { page, userEvent } from 'vitest/browser'
import { getExports, getParts } from '../../../../../../utils/test'
import Basic from '../examples/Basic.vue'
import Controlled from '../examples/Controlled.vue'
import WithField from '../examples/WithField.vue'
import { Edit, editAnatomy } from '../index'

describe('[edit] component', () => {
  it.each(getParts(editAnatomy))('should render part %s', async (part) => {
    render(Basic)
    expect(document.querySelector(part)).toBeInTheDocument()
  })

  it.each(getExports(editAnatomy))('should export %s', async (part) => {
    expect(Edit[part]).toBeDefined()
  })

  it('should be possible to focus the placeholder and enter a value', async () => {
    render(Controlled)
    await page.getByText('Placeholder').click()
    await userEvent.type(page.getByLabelText('editable input'), 'React')

    await expect.element(page.getByText('React')).toBeInTheDocument()
  })

  it.skip('should be possible to dbl click the placeholder to enter a value', async () => {
    render(Controlled, { props: { activationMode: 'dblclick' } })
    await userEvent.dblClick(page.getByText('Placeholder'))

    await userEvent.clear(page.getByRole('textbox'))
    await userEvent.type(page.getByRole('textbox'), 'React')

    await expect.element(page.getByText('React')).toBeInTheDocument()
  })

  it('should be possible to hide input if click EditableCancelTrigger ', async () => {
    render(Controlled, { props: { activationMode: 'dblclick' } })

    await userEvent.dblClick(page.getByText('Placeholder'))

    const input = page.getByLabelText('editable input')
    await expect.element(input).not.toHaveAttribute('hidden', '')

    const editableCancelTriggerButton = page.getByRole('button', {
      name: 'cancel',
    })

    await userEvent.click(editableCancelTriggerButton)

    await expect.element(input).toHaveAttribute('hidden', '')
  })
})

describe('editable / Field', () => {
  it('should set editable as required', async () => {
    render(WithField, { props: { required: true } })
    await expect.element(page.getByLabelText('editable input')).toBeRequired()
  })

  it('should set editable as disabled', async () => {
    render(WithField, { props: { disabled: true } })
    await expect.element(page.getByLabelText('editable input')).toBeDisabled()
  })

  it('should set editable as readonly', async () => {
    render(WithField, { props: { readOnly: true } })
    await expect.element(page.getByLabelText('editable input')).toHaveAttribute('readonly')
  })

  it('should display helper text', async () => {
    render(WithField)
    await expect.element(page.getByText('Additional Info')).toBeInTheDocument()
  })

  it('should display error text when error is present', async () => {
    render(WithField, { props: { invalid: true } })
    await expect.element(page.getByText('Error Info')).toBeInTheDocument()
  })

  it('should not display error text when no error is present', async () => {
    render(WithField)
    await expect.element(page.getByText('Error Info')).not.toBeInTheDocument()
  })
})
