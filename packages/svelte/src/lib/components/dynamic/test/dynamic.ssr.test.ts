import { render } from 'svelte/server'
import { describe, expect, it } from 'vitest'
import ServerContract from './ServerContract.svelte'

const cases = [
  { label: 'default seed', props: { defaultValue: ['Alpha', 'Beta'] }, values: ['Alpha', 'Beta'] },
  { label: 'live override', props: { defaultValue: ['Ignored'], value: ['Live'] }, values: ['Live'] },
  { label: 'explicit empty live value', props: { defaultValue: ['Ignored'], value: [] }, values: [] },
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
  it.each(cases)('renders $label without accessing the environment document', ({ props, values }) => {
    expect(typeof document).toBe('undefined')
    verify(render(ServerContract, { props }).body, values)
  })
})
