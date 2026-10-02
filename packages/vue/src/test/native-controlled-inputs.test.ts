import type { App, Component, ComputedRef } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createApp, defineComponent, h, nextTick, reactive } from 'vue'
import { assertCheckboxForm } from '../../../../utils/test/behavior-contracts'
import { Checkbox, useCheckbox } from '../components/checkbox'
import { Radio, useRadio } from '../components/radio'
import { Switch, useSwitch } from '../components/switch'

type Entry = 'Root' | 'RootProvider' | 'hook'
const entries: Entry[] = ['Root', 'RootProvider', 'hook']
const mounts: { app: App, container: HTMLElement }[] = []
let nextId = 0

afterEach(async () => {
  mounts.splice(0).forEach(({ app, container }) => {
    app.unmount()
    container.remove()
  })
  await nextTick()
})

async function flush() {
  for (let i = 0; i < 5; i++) {
    await nextTick()
    await Promise.resolve()
  }
}

async function fixture(namespace: any, hook: (props: any) => ComputedRef<any>, entry: Entry, initial: any, radio = false) {
  const props = reactive({ id: `native-input-${nextId++}`, name: 'choice', ...initial })
  let api: any
  function parts(value: any) {
    api = value
    if (entry === 'hook') {
      if (radio) {
        return h('div', api.getRootProps(), ['one', 'two'].map(value => h('label', api.getItemProps({ value }), [
          h('span', api.getItemControlProps({ value })),
          h('input', api.getItemHiddenInputProps({ value })),
        ])))
      }
      return h('label', api.getRootProps(), [h('span', api.getControlProps()), h('input', api.getHiddenInputProps())])
    }
    if (radio) {
      return ['one', 'two'].map(value => h(namespace.Item, { value }, {
        default: () => [h(namespace.ItemControl), h(namespace.ItemHiddenInput)],
      }))
    }
    return [h(namespace.Control), h(namespace.HiddenInput)]
  }
  const component: Component = defineComponent({
    setup() {
      if (entry === 'Root')
        return () => h(namespace.Root, props, { default: () => h(namespace.Context, {}, { default: parts }) })
      const value = hook(props)
      if (entry === 'hook')
        return () => parts(value.value)
      return () => h(namespace.RootProvider, { value: value.value }, {
        default: () => h(namespace.Context, {}, { default: parts }),
      })
    },
  })
  const container = document.createElement('div')
  document.body.append(container)
  const app = createApp(() => h('form', [h(component)]))
  mounts.push({ app, container })
  app.mount(container)
  await flush()
  return {
    props,
    container,
    get api() { return api },
    get input() { return container.querySelector('input')! },
    get inputs() { return [...container.querySelectorAll('input')] },
    get values() { return new FormData(container.querySelector('form')!).getAll('choice') },
  }
}

function assertChecked(instance: Awaited<ReturnType<typeof fixture>>, checked: boolean | 'indeterminate') {
  expect(instance.api.checked).toBe(checked === true)
  expect(instance.input.checked).toBe(checked === true)
  if ('indeterminate' in instance.api) {
    expect(instance.api.indeterminate).toBe(checked === 'indeterminate')
    expect(instance.input.indeterminate).toBe(checked === 'indeterminate')
  }
  expect(instance.container.querySelector('[data-part="control"]')?.getAttribute('data-state')).toBe(
    checked === 'indeterminate' ? 'indeterminate' : checked ? 'checked' : 'unchecked',
  )
  expect(instance.values).toEqual(checked === true ? ['yes'] : [])
}

function assertRadio(instance: Awaited<ReturnType<typeof fixture>>, value: string | null) {
  expect(instance.api.value).toBe(value)
  expect(instance.inputs.map(input => input.checked)).toEqual(['one', 'two'].map(item => value === item))
  expect([...instance.container.querySelectorAll('[data-part="item-control"]')].map(control => control.getAttribute('data-state')))
    .toEqual(['one', 'two'].map(item => value === item ? 'checked' : 'unchecked'))
  expect(instance.values).toEqual(value === null ? [] : [value])
}

describe('native controlled input reconciliation through every public entry', () => {
  for (const [name, namespace, hook] of [['Checkbox', Checkbox, useCheckbox], ['Switch', Switch, useSwitch]] as const) {
    for (const entry of entries) {
      it.each([true, false])(`${name} ${entry} restores vetoed checked=%s after repeated native activation`, async (checked) => {
        const onCheckedChange = vi.fn()
        const instance = await fixture(namespace, hook, entry, { checked, value: 'yes', onCheckedChange })
        assertChecked(instance, checked)
        for (let i = 0; i < 3; i++) {
          // Native click performs the browser's checked mutation before onClick.
          instance.input.click()
          await flush()
          assertChecked(instance, checked)
        }
        expect(onCheckedChange.mock.calls.map(([details]) => details.checked)).toEqual([!checked, !checked, !checked])
      })

      it(`${name} ${entry} preserves accepted and delayed parent updates`, async () => {
        const onCheckedChange = vi.fn()
        const instance = await fixture(namespace, hook, entry, { checked: true, value: 'yes', onCheckedChange })
        onCheckedChange.mockImplementation((details) => {
          instance.props.checked = details.checked
        })
        for (const checked of [false, true]) {
          instance.input.click()
          await flush()
          assertChecked(instance, checked)
        }
        onCheckedChange.mockImplementation(() => {})
        instance.input.click()
        await flush()
        assertChecked(instance, true)
        instance.props.checked = false
        await flush()
        assertChecked(instance, false)
        expect(onCheckedChange.mock.calls.map(([details]) => details.checked)).toEqual([false, true, false])
      })

      it(`${name} ${entry} retains machine ownership when a controlled prop becomes undefined`, async () => {
        const onCheckedChange = vi.fn()
        const instance = await fixture(namespace, hook, entry, { checked: true, value: 'yes', onCheckedChange })
        instance.props.checked = undefined
        await flush()
        assertChecked(instance, true)
        for (let i = 0; i < 3; i++) {
          instance.input.click()
          await flush()
          assertChecked(instance, true)
        }
        expect(onCheckedChange.mock.calls.map(([details]) => details.checked)).toEqual([false, false, false])
      })

      it(`${name} ${entry} preserves initially uncontrolled ownership when a live prop appears`, async () => {
        const onCheckedChange = vi.fn()
        const instance = await fixture(namespace, hook, entry, { checked: undefined, defaultChecked: true, value: 'yes', onCheckedChange })
        instance.props.checked = true
        await flush()
        for (const checked of [false, true]) {
          instance.input.click()
          await flush()
          assertChecked(instance, checked)
        }
        expect(onCheckedChange.mock.calls.map(([details]) => details.checked)).toEqual([false, true])
      })

      it(`${name} ${entry} leaves undefined live state uncontrolled`, async () => {
        const onCheckedChange = vi.fn()
        const instance = await fixture(namespace, hook, entry, { checked: undefined, defaultChecked: true, value: 'yes', onCheckedChange })
        for (const checked of [false, true]) {
          instance.input.click()
          await flush()
          assertChecked(instance, checked)
        }
        expect(onCheckedChange.mock.calls.map(([details]) => details.checked)).toEqual([false, true])
      })
    }
  }

  for (const entry of entries) {
    it(`Checkbox ${entry} restores native indeterminate state after a veto`, async () => {
      const onCheckedChange = vi.fn()
      const instance = await fixture(Checkbox, useCheckbox, entry, { checked: 'indeterminate', value: 'yes', onCheckedChange })
      assertChecked(instance, 'indeterminate')
      for (let i = 0; i < 2; i++) {
        instance.input.click()
        await flush()
        assertChecked(instance, 'indeterminate')
      }
      expect(onCheckedChange.mock.calls.map(([details]) => details.checked)).toEqual([true, true])
    })

    it.each(['one', null])(`Radio ${entry} restores the entire vetoed selection %s`, async (modelValue) => {
      const onValueChange = vi.fn()
      const instance = await fixture(Radio, useRadio, entry, { modelValue, onValueChange }, true)
      assertRadio(instance, modelValue)
      for (let i = 0; i < 3; i++) {
        instance.inputs[1].click()
        await flush()
        assertRadio(instance, modelValue)
      }
      expect(onValueChange.mock.calls.map(([details]) => details.value)).toEqual(['two', 'two', 'two'])
    })

    it(`Radio ${entry} retains machine ownership when modelValue becomes undefined`, async () => {
      const onValueChange = vi.fn()
      const instance = await fixture(Radio, useRadio, entry, { modelValue: 'one', onValueChange }, true)
      instance.props.modelValue = undefined
      await flush()
      assertRadio(instance, 'one')
      for (let i = 0; i < 3; i++) {
        instance.inputs[1].click()
        await flush()
        assertRadio(instance, 'one')
      }
      expect(onValueChange.mock.calls.map(([details]) => details.value)).toEqual(['two', 'two', 'two'])
    })

    it(`Radio ${entry} preserves initially uncontrolled ownership when modelValue appears`, async () => {
      const onValueChange = vi.fn()
      const instance = await fixture(Radio, useRadio, entry, { modelValue: undefined, defaultValue: 'one', onValueChange }, true)
      instance.props.modelValue = 'one'
      await flush()
      instance.inputs[1].click()
      await flush()
      assertRadio(instance, 'two')
      instance.inputs[0].click()
      await flush()
      assertRadio(instance, 'one')
      expect(onValueChange.mock.calls.map(([details]) => details.value)).toEqual(['two', 'one'])
    })

    it(`Radio ${entry} accepts parent updates and preserves uncontrolled selection`, async () => {
      const onValueChange = vi.fn()
      const instance = await fixture(Radio, useRadio, entry, { modelValue: 'one', onValueChange }, true)
      onValueChange.mockImplementation((details) => {
        instance.props.modelValue = details.value
      })
      instance.inputs[1].click()
      await flush()
      assertRadio(instance, 'two')
      instance.props.modelValue = 'one'
      await flush()
      assertRadio(instance, 'one')
      const uncontrolled = await fixture(Radio, useRadio, entry, { modelValue: undefined, defaultValue: 'one' }, true)
      uncontrolled.inputs[1].click()
      await flush()
      assertRadio(uncontrolled, 'two')
      assertRadio(instance, 'one')
    })
  }
})

for (const entry of entries) {
  it(`shared native reset: Checkbox ${entry} restores its original seed after later defaults`, async () => {
    const instance = await fixture(Checkbox, useCheckbox, entry, { checked: undefined, defaultChecked: true, value: 'yes' })
    for (let cycle = 0; cycle < 2; cycle++) {
      instance.input.click()
      await flush()
      assertChecked(instance, false)
      instance.props.defaultChecked = false
      await flush()
      instance.input.form!.reset()
      await vi.waitFor(() => {
        assertChecked(instance, true)
        assertCheckboxForm(instance.input, true)
      })
    }
  })
}
