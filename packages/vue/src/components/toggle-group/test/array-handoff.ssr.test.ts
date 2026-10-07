import { expect, it, vi } from 'vitest'
import { createSSRApp, defineComponent, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { ToggleGroup, useToggleGroup } from '../index'

const items = () => [h(ToggleGroup.Item, { value: 'a' }, () => 'A'), h(ToggleGroup.Item, { value: 'b' }, () => 'B')]
function selections(html: string) {
  return [...html.matchAll(/<button\b([^>]*)>/g)].map(([, props]) => /data-state="on"/.test(props))
}
it.each([
  { defaultValue: ['a'] },
  { modelValue: ['a'] },
  { modelValue: ['a'], defaultValue: ['b'] },
  { modelValue: [], defaultValue: ['a'] },
])('sSR honors selected model values without callbacks (%j)', async (props) => {
  const changed = vi.fn()
  const model = vi.fn()
  const html = await renderToString(createSSRApp({ render: () => h(ToggleGroup.Root, { ...props, 'onValueChange': changed, 'onUpdate:modelValue': model }, items) }))
  expect(selections(html)).toEqual(props.modelValue?.length === 0 ? [false, false] : [true, false])
  expect(changed).not.toHaveBeenCalled()
  expect(model).not.toHaveBeenCalled()
})
it('sSR RootProvider forwards the current API and IDs', async () => {
  const Parent = defineComponent({ setup() {
    const api = useToggleGroup({ id: 'ssr-owner', modelValue: ['b'], ids: { root: 'ssr-root', item: value => `ssr-${value}` } })
    return () => h(ToggleGroup.RootProvider, { value: api.value }, items)
  } })
  const html = await renderToString(createSSRApp(Parent))
  expect(selections(html)).toEqual([false, true])
  expect(html).toContain('id="ssr-root"')
  expect(html).toContain('id="ssr-b"')
})
