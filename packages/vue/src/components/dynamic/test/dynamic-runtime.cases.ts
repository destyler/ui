import type { UseDynamicProps } from '../composables/use-dynamic'
import { afterEach, expect, it, vi } from 'vitest'
import { createApp, defineComponent, h, nextTick, reactive } from 'vue'
import { Dynamic, useDynamic } from '../index'

const cleanups: Array<() => void> = []
afterEach(() => cleanups.splice(0).forEach(cleanup => cleanup()))

it('keeps Dynamic defaults seed-only, mutable live state and latest callbacks on the same DOM nodes', async () => {
  const first = vi.fn()
  const latest = vi.fn()
  const inputChanged = vi.fn()
  const props = reactive<UseDynamicProps>({ defaultValue: ['Seed'], onValueChange: first, onInputValueChange: inputChanged })
  let api: ReturnType<typeof useDynamic>
  const Fixture = defineComponent({
    setup() {
      api = useDynamic(props)
      return () => h(Dynamic.RootProvider, { value: api.value }, () => [h(Dynamic.Input), h(Dynamic.HiddenInput, { name: 'tags' })])
    },
  })
  const container = document.createElement('div')
  document.body.append(container)
  const app = createApp(Fixture)
  app.mount(container)
  cleanups.push(() => {
    app.unmount()
    container.remove()
  })
  const input = container.querySelector<HTMLInputElement>('[data-part=input]')!
  const hidden = container.querySelector<HTMLInputElement>('[name=tags]')!
  expect(api!.value.value).toEqual(['Seed'])
  api!.value.addValue('Added')
  await nextTick()
  expect(api!.value.value).toEqual(['Seed', 'Added'])
  Object.assign(props, { defaultValue: ['Ignored'], onValueChange: latest, readOnly: true })
  await nextTick()
  expect(api!.value.value).toEqual(['Seed', 'Added'])
  await vi.waitFor(() => expect(input.disabled).toBe(true))
  Object.assign(props, { modelValue: ['Parent'], inputValue: 'Parent text', readOnly: false })
  await nextTick()
  await vi.waitFor(() => expect(api!.value.value).toEqual(['Parent']))
  api!.value.setValue(['Internal', 'Second'])
  api!.value.setInputValue('Draft')
  await nextTick()
  expect(api!.value.value).toEqual(['Internal', 'Second'])
  expect(api!.value.inputValue).toBe('Draft')
  expect(hidden.value).toBe('["Internal","Second"]')
  expect(input.value).toBe('Draft')
  expect(first.mock.calls).toEqual([[{ value: ['Seed', 'Added'] }]])
  expect(latest.mock.calls).toEqual([[{ value: ['Internal', 'Second'] }]])
  expect(inputChanged.mock.calls).toEqual([[{ inputValue: 'Draft' }]])
  Object.assign(props, { modelValue: ['Later'], inputValue: 'Later text' })
  await nextTick()
  await vi.waitFor(() => expect(api!.value.value).toEqual(['Later']))
  await vi.waitFor(() => expect(api!.value.inputValue).toBe('Later text'))
  expect(input.value).toBe('Later text')
  expect(container.querySelector('[data-part=input]')).toBe(input)
  expect(container.querySelector('[name=tags]')).toBe(hidden)
  expect(latest).toHaveBeenCalledTimes(1)
  expect(inputChanged).toHaveBeenCalledTimes(1)
})
