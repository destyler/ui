import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import { page, userEvent } from 'vitest/browser'
import { FileUpload, fileUploadAnatomy } from '~/index'
import { getExports, getParts } from '../../../../../../utils/test'
import Basic from '../examples/Basic.vue'
import WithField from '../examples/WithField.vue'

describe('[file-upload] component', () => {
  it.each(getParts(fileUploadAnatomy))('should render part %s', async (part) => {
    render(Basic)
    expect(document.querySelector(part)).toBeInTheDocument()
  })

  it.each(getExports(fileUploadAnatomy))('should export %s', async (part) => {
    expect(FileUpload[part]).toBeDefined()
  })
})

describe('file Upload / Field', () => {
  it('should set file upload as required', async () => {
    render(WithField, { props: { required: true } })
    await expect.element(page.getByTestId('input')).toBeRequired()
  })

  it('should set file upload as disabled', async () => {
    render(WithField, { props: { disabled: true } })
    await expect.element(page.getByTestId('input')).toBeDisabled()
  })

  it('should display helper text', async () => {
    render(WithField)
    await expect.element(page.getByText('Additional Info')).toBeInTheDocument()
  })

  it('should display error text when error is present', async () => {
    render(WithField, { props: { invalid: true } })
    await expect.element(page.getByText('Error Info')).toBeInTheDocument()
  })

  it('should focus on file upload when label is clicked', async () => {
    render(WithField)
    await userEvent.click(page.getByText(/label/i))
    await expect.element(page.getByTestId('input')).toHaveFocus()
  })

  it('should not display error text when no error is present', async () => {
    render(WithField)
    await expect.element(page.getByText('Error Info')).not.toBeInTheDocument()
  })
})
