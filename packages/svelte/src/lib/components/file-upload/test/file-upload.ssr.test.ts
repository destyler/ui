import { render } from 'svelte/server'
import { expect, it } from 'vitest'
import RuntimeContract from './RuntimeContract.svelte'

it('renders custom IDs, form metadata and disabled state without a browser', () => {
  const { body: markup } = render(RuntimeContract, { props: { initialProps: {
    id: 'ssr',
    ids: { hiddenInput: 'custom-input', label: 'custom-label' },
    name: 'attachments',
    accept: 'image/*',
    maxFiles: 2,
    disabled: true,
    required: true,
  } } })
  expect(markup).toContain('id="custom-input"')
  expect(markup).toContain('for="custom-input"')
  expect(markup).toContain('name="attachments"')
  expect(markup).toContain('accept="image/*"')
  expect(markup).toMatch(/\smultiple(?:[\s>]|="")/)
  expect(markup).toMatch(/\sdisabled(?:[\s>]|="")/)
  expect(markup).toMatch(/\srequired(?:[\s>]|="")/)
})
