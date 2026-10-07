import { renderToString } from 'solid-js/web'
import { expect, it } from 'vitest'
import { FileUpload } from '../src/components/file-upload'

it('renders custom IDs, form metadata and disabled state without a browser', () => {
  const markup = renderToString(() => (
    <FileUpload.Root id="ssr" ids={{ hiddenInput: 'custom-input', label: 'custom-label' }} name="attachments" accept="image/*" maxFiles={2} disabled required>
      <FileUpload.Label>Attachments</FileUpload.Label>
      <FileUpload.Trigger>Choose</FileUpload.Trigger>
      <FileUpload.HiddenInput />
    </FileUpload.Root>
  ))
  expect(markup).toContain('id="custom-input"')
  expect(markup).toContain('for="custom-input"')
  expect(markup).toContain('name="attachments"')
  expect(markup).toContain('accept="image/*"')
  expect(markup).toMatch(/\smultiple(?:[\s>]|="")/)
  expect(markup).toMatch(/\sdisabled(?:[\s>]|="")/)
  expect(markup).toMatch(/\srequired(?:[\s>]|="")/)
})
