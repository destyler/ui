import { expect, it } from 'vitest'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { FileUpload } from '../index'

it('renders custom IDs, form metadata and disabled state without a browser', async () => {
  const markup = await renderToString(createSSRApp({ render: () => h(FileUpload.Root, {
    id: 'ssr',
    ids: { hiddenInput: 'custom-input', label: 'custom-label' },
    name: 'attachments',
    accept: 'image/*',
    maxFiles: 2,
    disabled: true,
    required: true,
  }, () => [h(FileUpload.Label, {}, () => 'Attachments'), h(FileUpload.Trigger, {}, () => 'Choose'), h(FileUpload.HiddenInput)]) }))
  expect(markup).toContain('id="custom-input"')
  expect(markup).toContain('for="custom-input"')
  expect(markup).toContain('name="attachments"')
  expect(markup).toContain('accept="image/*"')
  expect(markup).toMatch(/\smultiple(?:[\s>]|="")/)
  expect(markup).toMatch(/\sdisabled(?:[\s>]|="")/)
  expect(markup).toMatch(/\srequired(?:[\s>]|="")/)
})
