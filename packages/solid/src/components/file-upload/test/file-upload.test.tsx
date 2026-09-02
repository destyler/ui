import { render, screen, waitFor } from '@solidjs/testing-library'
import user from '@testing-library/user-event'
import { createSignal } from 'solid-js'
import { FileUpload, fileUploadAnatomy } from '../'
import { getExports, getParts } from '../../../setup-test'
import { WithField } from '../examples/WithField'
import { ComponentUnderTest } from './basic'

describe('fileUpload', () => {
  it.each(getParts(fileUploadAnatomy))('should render part! %s', async (part) => {
    render(() => <ComponentUnderTest />)

    expect(document.querySelector(part)).toBeInTheDocument()
  })

  it.each(getExports(fileUploadAnatomy))('should export %s', async (part) => {
    expect(FileUpload[part]).toBeDefined()
  })

  it('updates item preview when type and file change', async () => {
    const [file, setFile] = createSignal(new File([''], 'photo.png', { type: 'image/png' }))
    const [type, setType] = createSignal('^image/')

    render(() => (
      <FileUpload.Root>
        <FileUpload.Item file={file()}>
          <FileUpload.ItemPreview type={type()} data-testid="preview">
            Preview
          </FileUpload.ItemPreview>
        </FileUpload.Item>
      </FileUpload.Root>
    ))

    expect(screen.getByTestId('preview')).toBeInTheDocument()
    expect(screen.getByTestId('preview')).not.toHaveAttribute('type')

    setType('^text/')
    await waitFor(() => expect(screen.queryByTestId('preview')).not.toBeInTheDocument())

    setFile(new File([''], 'notes.txt', { type: 'text/plain' }))
    await waitFor(() => expect(screen.getByTestId('preview')).toBeInTheDocument())
    expect(screen.getByTestId('preview')).not.toHaveAttribute('type')
  })
})

describe('file Upload / Field', () => {
  it('should set file upload as required', async () => {
    render(() => <WithField required />)
    expect(screen.getByTestId('input')).toBeRequired()
  })

  it('should set file upload as disabled', async () => {
    render(() => <WithField disabled />)
    expect(screen.getByTestId('input')).toBeDisabled()
  })

  it.skip('should set file upload as readonly', async () => {
    render(() => <WithField readOnly />)
    expect(screen.getByRole('button', { name: /select/i })).toHaveAttribute('readonly')
  })

  it('should display helper text', async () => {
    render(() => <WithField />)
    expect(screen.getByText('Additional Info')).toBeInTheDocument()
  })

  it('should display error text when error is present', async () => {
    render(() => <WithField invalid />)
    expect(screen.getByText('Error Info')).toBeInTheDocument()
  })

  it('should focus on input when label is clicked', async () => {
    render(() => <WithField />)
    await user.click(screen.getByText(/label/i))
    expect(screen.getByTestId('input')).toHaveFocus()
  })

  it('should not display error text when no error is present', async () => {
    render(() => <WithField />)
    expect(screen.queryByText('Error Info')).not.toBeInTheDocument()
  })
})
