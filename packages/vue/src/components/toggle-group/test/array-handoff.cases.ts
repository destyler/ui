import type { App, VNode } from 'vue'
import { afterEach, expect, it, vi } from 'vitest'
import { createApp, defineComponent, h, nextTick, ref, shallowRef } from 'vue'
import { ToggleGroup, useToggleGroup } from '../index'

const cleanups: VoidFunction[] = []
afterEach(() => cleanups.splice(0).reverse().forEach(cleanup => cleanup()))
const items = () => [h(ToggleGroup.Item, { value: 'a' }, () => 'A'), h(ToggleGroup.Item, { value: 'b' }, () => 'B')]
const states = (container: HTMLElement) => Array.from(container.querySelectorAll('button')).map(button => button.dataset.state)
async function mount(render: () => VNode) {
  const container = document.createElement('div')
  document.body.append(container)
  const app: App = createApp(defineComponent({ setup: () => render }))
  cleanups.push(() => {
    try {
      app.unmount()
    }
    finally {
      container.remove()
    }
  })
  app.mount(container)
  await nextTick()
  return container
}

it.each([false, true])('controlled veto waits for a model update (multiple=%s)', async (multiple) => {
  const value = ref(['a'])
  const changed = vi.fn()
  const model = vi.fn()
  const container = await mount(() => h(ToggleGroup.Root, { 'modelValue': value.value, multiple, 'onValueChange': changed, 'onUpdate:modelValue': model }, items))
  container.querySelectorAll('button')[1].click()
  await nextTick()
  const requested = multiple ? ['a', 'b'] : ['b']
  expect(changed.mock.calls).toEqual([[{ value: requested }]])
  expect(model.mock.calls).toEqual([[requested]])
  expect(states(container)).toEqual(['on', 'off'])
  value.value = requested
  await nextTick()
  await expect.poll(() => states(container)).toEqual(multiple ? ['on', 'on'] : ['off', 'on'])
  expect(changed).toHaveBeenCalledTimes(1)
})

it('default selection remains a seed through unrelated prop updates', async () => {
  const extra = ref('before')
  const changed = vi.fn()
  const container = await mount(() => h(ToggleGroup.Root, { 'modelValue': undefined, 'defaultValue': ['a'], 'data-extra': extra.value, 'onValueChange': changed }, items))
  container.querySelectorAll('button')[1].click()
  await nextTick()
  await expect.poll(() => states(container)).toEqual(['off', 'on'])
  extra.value = 'after'
  await nextTick()
  await expect.poll(() => states(container)).toEqual(['off', 'on'])
  expect(changed.mock.calls).toEqual([[{ value: ['b'] }]])
})

it('uses current callbacks and disabled values after updates', async () => {
  const disabled = ref(true)
  const handler = shallowRef(vi.fn())
  const first = handler.value
  const container = await mount(() => h(ToggleGroup.Root, { modelValue: ['a'], disabled: disabled.value, onValueChange: handler.value }, items))
  container.querySelectorAll('button')[1].click()
  await nextTick()
  expect(first).not.toHaveBeenCalled()
  handler.value = vi.fn()
  disabled.value = false
  await nextTick()
  await expect.poll(() => container.querySelectorAll('button')[1].disabled).toBe(false)
  container.querySelectorAll('button')[1].click()
  await nextTick()
  expect(first).not.toHaveBeenCalled()
  expect(handler.value.mock.calls).toEqual([[{ value: ['b'] }]])
})

it('rootProvider and slot context follow a replacement public API', async () => {
  const alternate = ref(false)
  const Parent = defineComponent({ setup() {
    const first = useToggleGroup({ id: 'first-provider', modelValue: ['a'] })
    const second = useToggleGroup({ id: 'second-provider', modelValue: ['b'] })
    return () => h(ToggleGroup.RootProvider, { value: alternate.value ? second.value : first.value }, () => [
      ...items(),
      h(ToggleGroup.Context, {}, { default: (api: { value: string[] }) => h('output', api.value.join(',')) }),
    ])
  } })
  const container = await mount(() => h(Parent))
  expect(states(container)).toEqual(['on', 'off'])
  expect(container.querySelector('output')!.textContent).toBe('a')
  alternate.value = true
  await nextTick()
  await expect.poll(() => states(container)).toEqual(['off', 'on'])
  expect(container.querySelector('output')!.textContent).toBe('b')
  expect(container.querySelector('[data-part="root"]')!.id).toBe('toggle:second-provider')
})

it('reflects a parent array mutated in place', async () => {
  const value = ref(['a'])
  const changed = vi.fn()
  const container = await mount(() => h(ToggleGroup.Root, { modelValue: value.value, onValueChange: changed }, items))
  value.value.splice(0, 1, 'b')
  await nextTick()
  await expect.poll(() => states(container)).toEqual(['off', 'on'])
  expect(changed).not.toHaveBeenCalled()
})

it.each([
  { initial: ['a'], expected: ['a', 'b'], mutate: (value: string[]) => value.push('b') },
  { initial: ['a', 'b'], expected: ['b', 'a'], mutate: (value: string[]) => value.reverse() },
  { initial: ['a', 'b'], expected: [], mutate: (value: string[]) => value.splice(0) },
])('tracks exact accepted array contents without echoing parent mutations (%j)', async ({ initial, expected, mutate }) => {
  const value = ref([...initial])
  const changed = vi.fn()
  const model = vi.fn()
  const container = await mount(() => h(ToggleGroup.Root, { 'modelValue': value.value, 'multiple': true, 'onValueChange': changed, 'onUpdate:modelValue': model }, () => [
    ...items(),
    h(ToggleGroup.Context, {}, { default: (api: { value: string[] }) => h('output', JSON.stringify(api.value)) }),
  ]))
  const firstButton = container.querySelector('button')
  mutate(value.value)
  await nextTick()
  await expect.poll(() => container.querySelector('output')!.textContent).toBe(JSON.stringify(expected))
  expect(states(container)).toEqual(['a', 'b'].map(item => expected.includes(item) ? 'on' : 'off'))
  expect(value.value).toEqual(expected)
  expect(changed).not.toHaveBeenCalled()
  expect(model).not.toHaveBeenCalled()
  value.value = [...expected]
  await nextTick()
  await nextTick()
  expect(container.querySelector('button')).toBe(firstButton)
  expect(changed).not.toHaveBeenCalled()
  expect(model).not.toHaveBeenCalled()
})

it('tracks repeated in-place writes through the public composable and RootProvider', async () => {
  const value = ref(['a'])
  const emit = vi.fn()
  const Parent = defineComponent({ setup() {
    const api = useToggleGroup({
      get modelValue() {
        return value.value
      },
      multiple: true,
    }, emit)
    return () => h(ToggleGroup.RootProvider, { value: api.value }, () => [
      ...items(),
      h(ToggleGroup.Context, {}, { default: (context: { value: string[] }) => h('output', JSON.stringify(context.value)) }),
    ])
  } })
  const container = await mount(() => h(Parent))
  for (const expected of [['b'], ['b', 'a'], []]) {
    value.value.splice(0, value.value.length, ...expected)
    await nextTick()
    await expect.poll(() => container.querySelector('output')!.textContent).toBe(JSON.stringify(expected))
    expect(states(container)).toEqual(['a', 'b'].map(item => expected.includes(item) ? 'on' : 'off'))
    expect(emit).not.toHaveBeenCalled()
  }
})
