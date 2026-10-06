import { describe, expect, it } from 'vitest'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { EnvironmentProvider } from '../../../providers/environment'
import { Dynamic } from '../index'

const ids = { input: 'entry-tags', hiddenInput: 'submitted-tags', item: ({ index, value }: { index: string | number, value: string }) => `preview-${index}-${value}`, itemInput: ({ index, value }: { index: string | number, value: string }) => `editor-${index}-${value}` }

const cases = [
  { label: 'default seed', props: { defaultValue: ['Alpha', 'Beta'] }, values: ['Alpha', 'Beta'] },
  { label: 'live override', props: { defaultValue: ['Ignored'], modelValue: ['Live'] }, values: ['Live'] },
  { label: 'explicit empty live value', props: { defaultValue: ['Ignored'], modelValue: [] }, values: [] },
]

function verify(html: string, values: string[]) {
  const decode = (text: string) => text.replaceAll('&quot;', '"').replaceAll('&#34;', '"').replaceAll('&#x27;', '\'').replaceAll('&amp;', '&')
  const previews = Array.from(html.matchAll(/<div[^>]*data-part="item-preview"[^>]*>/g), match => match[0])
  expect(previews.map(tag => tag.match(/data-value="([^"]*)"/)?.[1])).toEqual(values)
  expect(previews.map(tag => tag.match(/id="([^"]*)"/)?.[1])).toEqual(values.map((value, index) => `preview-${index}-${value}`))
  const editors = Array.from(html.matchAll(/<input[^>]*data-part="item-input"[^>]*>/g), match => match[0])
  expect(editors.map(tag => tag.match(/id="([^"]*)"/)?.[1])).toEqual(values.map((value, index) => `editor-${index}-${value}`))
  expect(editors.every(tag => /\shidden[=\s>]/.test(tag))).toBe(true)
  const hidden = html.match(/<input[^>]*id="submitted-tags"[^>]*>/)?.[0]
  expect(hidden).toBeDefined()
  expect(decode(hidden!.match(/\bvalue="([^"]*)"/)?.[1] ?? '')).toBe(JSON.stringify(values))
  expect(hidden).toContain('name="tags"')
  const label = html.match(/<label[^>]*>/)?.[0]
  expect(label).toContain('for="entry-tags"')
  const entry = html.match(/<input[^>]*data-part="input"[^>]*>/)?.[0]
  expect(entry).toContain('id="entry-tags"')
  expect(entry).toContain('value="Draft"')
  expect(html).not.toContain('data-highlighted=""')
}

describe('dynamic server-rendered form contract', () => {
  it.each(cases)('renders $label without accessing the environment document', async ({ props, values }) => {
    expect(typeof document).toBe('undefined')
    const rejectDocument = () => {
      throw new Error('Dynamic SSR must not access the DOM')
    }
    const html = await renderToString(createSSRApp({ render: () => h(EnvironmentProvider, { value: rejectDocument }, () =>
      h(Dynamic.Root, { id: 'ssr-tags', name: 'tags', inputValue: 'Draft', ids, ...props }, () => [
        h(Dynamic.Label, {}, () => 'Tags'),
        h(Dynamic.Control, {}, () => [
          h(Dynamic.Context, {}, { default: (api: { value: string[] }) => api.value.map((value, index) =>
            h(Dynamic.Item, { value, index, key: `${index}:${value}` }, () => [
              h(Dynamic.ItemPreview, {}, () => [h(Dynamic.ItemText, {}, () => value), h(Dynamic.ItemDeleteTrigger, {}, () => 'Delete')]),
              h(Dynamic.ItemInput),
            ])) }),
          h(Dynamic.Input),
          h(Dynamic.ClearTrigger, {}, () => 'Clear'),
        ]),
        h(Dynamic.HiddenInput),
      ])) }))
    verify(html, values)
  })
})
