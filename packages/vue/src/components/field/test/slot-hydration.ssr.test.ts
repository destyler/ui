import { expect, it, vi } from 'vitest'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { Field } from '../index'

it.each([
  { tag: 'input', initial: 'seed' },
  { tag: 'input', initial: '' },
  { tag: 'textarea', initial: 'seed' },
  { tag: 'textarea', initial: '' },
])('renders $tag modelValue=$initial without a DOM or synthesized child content', async ({ tag, initial }) => {
  expect(typeof document).toBe('undefined')
  const onInput = vi.fn()
  const component = tag === 'input' ? Field.Input : Field.Textarea
  const html = await renderToString(createSSRApp({
    render: () => h(Field.Root, { id: 'server' }, () => h(component, { modelValue: initial, onInput })),
  }))
  if (tag === 'input')
    expect(html).toMatch(initial ? /<input[^>]* value="seed"/ : /<input[^>]* value(?:=""|(?=[ >]))/)
  else
    expect(html).toMatch(new RegExp(`<textarea[^>]*>${initial}</textarea>`))
  expect(onInput).not.toHaveBeenCalled()
})
