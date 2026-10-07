import type { CheckedState } from '@destyler/checkbox'
import { describe, expect, it, vi } from 'vitest'
import { createApp, defineComponent, h, mergeProps, nextTick, reactive } from 'vue'
import { Checkbox, useCheckbox, useCheckboxContext } from '../index'

async function settle() {
  for (let turn = 0; turn < 5; turn++)
    await nextTick()
}

function mountGroup(mode: 'uncontrolled' | 'accept' | 'veto' | 'delay', value = 'alpha') {
  let api!: ReturnType<typeof useCheckboxContext>
  const parent = reactive<{ value: string[], name: string, itemValue: string }>({ value: [], name: 'answer', itemValue: value })
  const trace: string[] = []
  const checkedChange = vi.fn(() => trace.push('item'))
  const checkedChangeSecond = vi.fn(() => trace.push('item-second'))
  const updateChecked = vi.fn(() => trace.push('binding'))
  const valueChange = vi.fn((next: string[]) => {
    trace.push('group')
    if (mode === 'accept')
      parent.value = next
  })
  const itemListeners = mergeProps({ onCheckedChange: checkedChange }, { onCheckedChange: checkedChangeSecond })
  expect(Array.isArray(itemListeners.onCheckedChange)).toBe(true)
  const capture = defineComponent({
    setup() {
      api = useCheckboxContext()
      return () => null
    },
  })
  const fixture = defineComponent({
    setup: () => () => h('form', {}, [
      h(Checkbox.Group, {
        defaultValue: [],
        modelValue: mode === 'uncontrolled' ? undefined : parent.value,
        name: parent.name,
        onValueChange: valueChange,
      }, () => [
        h(Checkbox.Root, {
          'id': 'item',
          'value': parent.itemValue,
          ...itemListeners,
          'onUpdate:checked': updateChecked,
        }, () => [h(Checkbox.Label, {}, () => 'Item'), h(Checkbox.Control), h(Checkbox.HiddenInput), h(capture)]),
        h(Checkbox.Root, { id: 'other', value: 'other' }, () => [h(Checkbox.Label, {}, () => 'Other'), h(Checkbox.HiddenInput)]),
      ]),
    ]),
  })
  const container = document.createElement('div')
  document.body.append(container)
  const app = createApp(fixture)
  app.mount(container)
  return {
    api: () => api.value,
    parent,
    checkedChange,
    checkedChangeSecond,
    trace,
    updateChecked,
    valueChange,
    input: () => container.querySelector<HTMLInputElement>('input')!,
    entries: () => Array.from(new FormData(container.querySelector('form')!).entries()),
    dispose() {
      app.unmount()
      container.remove()
    },
  }
}

describe('checkbox group item emissions', () => {
  it.each(['uncontrolled', 'accept', 'veto', 'delay'] as const)('keeps item events and group ownership in %s mode', async (mode) => {
    const fixture = mountGroup(mode, '')
    try {
      await settle()
      const input = fixture.input()
      expect(fixture.entries()).toEqual([])
      fixture.api().setChecked(true)
      await settle()
      expect(fixture.valueChange.mock.calls).toEqual([[['']]])
      expect(fixture.checkedChange.mock.calls).toEqual([[{ checked: true }]])
      expect(fixture.checkedChangeSecond.mock.calls).toEqual([[{ checked: true }]])
      expect(fixture.updateChecked.mock.calls).toEqual([[true]])
      expect(fixture.trace).toEqual(mode === 'uncontrolled'
        ? ['item', 'item-second', 'binding', 'group']
        : ['group', 'item', 'item-second', 'binding'])
      const accepted = mode === 'uncontrolled' || mode === 'accept'
      expect(fixture.api().checked).toBe(accepted)
      expect(fixture.entries()).toEqual(accepted ? [['answer', '']] : [])
      expect(fixture.input()).toBe(input)
      if (mode === 'delay') {
        fixture.parent.value = ['']
        await settle()
        expect(fixture.api().checked).toBe(true)
        expect(fixture.entries()).toEqual([['answer', '']])
        expect(fixture.checkedChange).toHaveBeenCalledTimes(1)
      }
      if (mode !== 'veto') {
        fixture.api().setChecked(false)
        await settle()
        expect(fixture.checkedChange.mock.calls).toEqual([[{ checked: true }], [{ checked: false }]])
        expect(fixture.valueChange.mock.calls).toEqual([[['']], [[]]])
      }
      else {
        fixture.api().setChecked(true)
        await settle()
        expect(fixture.checkedChange.mock.calls).toEqual([[{ checked: true }], [{ checked: true }]])
        expect(fixture.entries()).toEqual([])
      }
    }
    finally { fixture.dispose() }
  })

  it('keeps native activation, renamed fields and dynamic membership connected to the same input', async () => {
    const fixture = mountGroup('accept')
    try {
      await settle()
      const input = fixture.input()
      input.click()
      await settle()
      expect(fixture.checkedChange.mock.calls).toEqual([[{ checked: true }]])
      expect(fixture.entries()).toEqual([['answer', 'alpha']])
      fixture.parent.name = 'renamed'
      fixture.parent.itemValue = 'beta'
      await settle()
      expect(fixture.input()).toBe(input)
      expect(fixture.api().checked).toBe(false)
      expect(fixture.entries()).toEqual([])
      input.click()
      await settle()
      expect(fixture.valueChange.mock.calls).toEqual([[['alpha']], [['alpha', 'beta']]])
      expect(fixture.entries()).toEqual([['renamed', 'beta']])
      expect(fixture.updateChecked.mock.calls).toEqual([[true], [true]])
    }
    finally { fixture.dispose() }
  })

  it('preserves standalone component emissions', async () => {
    const checkedChange = vi.fn()
    const updateChecked = vi.fn()
    const container = document.createElement('div')
    document.body.append(container)
    const app = createApp({ render: () => h(Checkbox.Root, { 'onCheckedChange': checkedChange, 'onUpdate:checked': updateChecked }, () => h(Checkbox.HiddenInput)) })
    app.mount(container)
    try {
      await settle()
      container.querySelector('input')!.click()
      await settle()
      expect(checkedChange.mock.calls).toEqual([[{ checked: true }]])
      expect(updateChecked.mock.calls).toEqual([[true]])
    }
    finally {
      app.unmount()
      container.remove()
    }
  })

  it('composes a direct hook callback with the provided emitter exactly once', async () => {
    const callback = vi.fn()
    const emit = vi.fn()
    let api!: ReturnType<typeof useCheckbox>
    const container = document.createElement('div')
    document.body.append(container)
    const app = createApp(defineComponent({
      setup() {
        api = useCheckbox({ id: 'direct', onCheckedChange: callback }, emit)
        return () => h('input', api.value.getHiddenInputProps())
      },
    }))
    app.mount(container)
    try {
      await settle()
      api.value.setChecked(true)
      await settle()
      expect(callback.mock.calls).toEqual([[{ checked: true }]])
      expect(emit.mock.calls).toEqual([['checkedChange', { checked: true }], ['update:checked', true satisfies CheckedState]])
    }
    finally {
      app.unmount()
      container.remove()
    }
  })
  it('retains standalone indeterminate ownership and distinct notifications', async () => {
    const checkedChange = vi.fn()
    const updateChecked = vi.fn()
    let api!: ReturnType<typeof useCheckboxContext>
    const capture = defineComponent({ setup() {
      api = useCheckboxContext()
      return () => null
    } })
    const container = document.createElement('div')
    document.body.append(container)
    const app = createApp({ render: () => h(Checkbox.Root, { 'checked': 'indeterminate', 'onCheckedChange': checkedChange, 'onUpdate:checked': updateChecked }, () => [h(Checkbox.Control), h(Checkbox.HiddenInput), h(capture)]) })
    app.mount(container)
    try {
      await settle()
      expect(api.value.checked).toBe(false)
      expect(api.value.indeterminate).toBe(true)
      container.querySelector('input')!.click()
      await settle()
      expect(checkedChange.mock.calls).toEqual([[{ checked: true }]])
      expect(updateChecked.mock.calls).toEqual([[true]])
      expect(api.value.indeterminate).toBe(true)
      expect(container.querySelector('[data-part="control"]')!.getAttribute('data-state')).toBe('indeterminate')
    }
    finally {
      app.unmount()
      container.remove()
    }
  })
})
