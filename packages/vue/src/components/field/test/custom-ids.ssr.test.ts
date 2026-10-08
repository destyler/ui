import { expect, it } from 'vitest'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { Field } from '../index'

it.each([
  { ids: undefined, root: 'field::seed', control: 'seed' },
  { ids: { root: 'custom-root' }, root: 'custom-root', control: 'seed' },
  { ids: { control: 'custom-control' }, root: 'field::seed', control: 'custom-control' },
  { ids: { root: 'custom-root', control: 'custom-control' }, root: 'custom-root', control: 'custom-control' },
])('renders distinct root $root and control $control IDs without a DOM', async ({ ids, root, control }) => {
  expect(typeof document).toBe('undefined')
  const html = await renderToString(createSSRApp({
    render: () => h(Field.Root, { id: 'seed', ids }, () => [
      h(Field.Label, null, () => 'Name'),
      h(Field.Input, { asChild: true }, () => h('input')),
    ]),
  }))
  expect(html).toMatch(new RegExp(`<div[^>]* id="${root}"`))
  expect(html).toMatch(new RegExp(`<input[^>]* id="${control}"`))
  expect(html).toMatch(new RegExp(`<label[^>]* for="${control}"`))
})
