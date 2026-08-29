import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import Basic from '../examples/Basic.svelte'
import RootProvider from '../examples/RootProvider.svelte'
import WithField from '../examples/WithField.svelte'
import { FileUpload, fileUploadAnatomy } from '../index'

const componentExports = FileUpload as unknown as Record<string, unknown>

describe('[file-upload] component', () => {
  it.each(fileUploadAnatomy.keys())('renders part %s', async (part) => {
    await render(Basic)
    const dataPart = part.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)
    expect(document.querySelector(`[data-scope="file-upload"][data-part="${dataPart}"]`)).not.toBeNull()
  })

  it.each(fileUploadAnatomy.keys())('exports %s', (part) => {
    const exportName = `${part.charAt(0).toUpperCase()}${part.slice(1)}`
    expect(componentExports[exportName], `FileUpload.${exportName}`).toBeDefined()
  })

  it('renders the dropzone, trigger, and file preview', async () => {
    const screen = await render(Basic)
    await expect.element(screen.getByText('Drag your file(s) here')).toBeVisible()
    await expect.element(screen.getByRole('button', { name: 'Choose file(s)' })).toBeVisible()
    await expect.element(screen.getByText('test-image.png')).toBeVisible()
    expect(document.querySelector('[data-part="item-group"]')?.tagName).toBe('UL')
    expect(document.querySelector('[data-part="item"]')?.tagName).toBe('LI')
  })

  it('works with RootProvider', async () => {
    const screen = await render(RootProvider)
    await expect.element(screen.getByText('File Upload')).toBeVisible()
    await expect.element(screen.getByRole('button', { name: 'Clear' })).toBeVisible()
  })
})

describe('[file-upload] field integration', () => {
  it('inherits required and disabled state', async () => {
    const required = await render(WithField, { props: { required: true } })
    await expect.element(required.getByTestId('input')).toBeRequired()
  })

  it('disables the hidden file input', async () => {
    const screen = await render(WithField, { props: { disabled: true } })
    await expect.element(screen.getByTestId('input')).toBeDisabled()
  })

  it('renders helper and conditional error text', async () => {
    const screen = await render(WithField, { props: { invalid: true } })
    await expect.element(screen.getByText('Additional Info')).toBeVisible()
    await expect.element(screen.getByText('Error Info')).toBeVisible()
  })

  it('focuses the input when the label is clicked', async () => {
    const screen = await render(WithField)
    await screen.getByText('Label').click()
    await expect.element(screen.getByTestId('input')).toHaveFocus()
  })

  it('hides field error text when valid', async () => {
    const screen = await render(WithField)
    await expect.element(screen.getByText('Error Info')).not.toBeInTheDocument()
  })
})
