import type { Component } from 'vue'
import type { ElementIds } from '../types'
import { afterEach, describe, expect, it } from 'vitest'
import { createApp, createSSRApp, defineComponent, h, nextTick, reactive } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { Field } from '../index'

type Control = 'input' | 'textarea' | 'select'
type Mode = 'default' | 'root' | 'control' | 'both'
const disposers: (() => void)[] = []
const controls = { input: Field.Input, textarea: Field.Textarea, select: Field.Select }
function partIds(mode: Mode, prefix: string): ElementIds | undefined {
  if (mode === 'default')
    return undefined
  return {
    ...(mode === 'root' || mode === 'both' ? { root: `${prefix}-root` } : {}),
    ...(mode === 'control' || mode === 'both' ? { control: `${prefix}-control` } : {}),
    label: `${prefix}-label`,
    helperText: `${prefix}-helper`,
    errorText: `${prefix}-error`,
  }
}
afterEach(() => {
  disposers.splice(0).forEach(dispose => dispose())
  document.body.replaceChildren()
})

async function mount(control: Control, mode: Mode, hydrate = false, explicitControlId = false) {
  const state = reactive({ id: 'seed', ids: partIds(mode, 'first'), model: 'initial' })
  let contextIds: Record<string, string> = {}
  const options = () => [h('option', { value: 'initial' }, 'Initial'), h('option', { value: 'edited' }, 'Edited')]
  const children = () => [
    h(Field.Label, explicitControlId ? { id: 'direct-label', htmlFor: 'direct-control' } : null, () => 'Name'),
    h(controls[control] as Component, {
      'asChild': hydrate,
      'modelValue': state.model,
      'onUpdate:modelValue': (value: string) => { state.model = value },
      ...(explicitControlId ? { id: 'direct-control' } : {}),
    }, hydrate ? () => h(control, null, control === 'select' ? options() : undefined) : control === 'select' ? options : undefined),
    h(Field.HelperText, null, () => 'Help'),
    h(Field.ErrorText, null, () => 'Error'),
    h(Field.Context, null, { default: (api: { ids: Record<string, string> }) => {
      contextIds = api.ids
      return null
    } }),
  ]
  const Fixture = defineComponent({
    setup: () => () => h(Field.Root, { id: state.id, ids: state.ids, invalid: true }, children),
  })
  const container = document.createElement('div')
  document.body.append(container)
  let serverRoot: Element | null = null
  let serverControl: Element | null = null
  if (hydrate) {
    container.innerHTML = await renderToString(createSSRApp(Fixture))
    serverRoot = container.firstElementChild
    serverControl = container.querySelector(control)
    assertIds()
  }
  const app = (hydrate ? createSSRApp : createApp)(Fixture)
  const warnings: string[] = []
  app.config.warnHandler = warning => warnings.push(warning)
  app.mount(container)
  disposers.push(() => {
    app.unmount()
    container.remove()
  })
  await nextTick()
  if (hydrate) {
    expect(container.firstElementChild).toBe(serverRoot)
    expect(container.querySelector(control)).toBe(serverControl)
  }
  expect(warnings).toEqual([])

  function assertIds() {
    const root = container.firstElementChild!
    const input = container.querySelector<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(control)!
    const label = container.querySelector('label')!
    expect(root.id).toBe(state.ids?.root ?? `field::${state.id}`)
    expect(input.id).toBe(explicitControlId ? 'direct-control' : state.ids?.control ?? state.id)
    expect(label.htmlFor).toBe(input.id)
    expect(label.control).toBe(input)
    expect(label.id).toBe(explicitControlId ? 'direct-label' : state.ids?.label ?? `field::${state.id}::label`)
    expect(container.querySelector('[data-part="helper-text"]')!.id).toBe(state.ids?.helperText ?? `field::${state.id}::helper-text`)
    expect(container.querySelector('[data-part="error-text"]')!.id).toBe(state.ids?.errorText ?? `field::${state.id}::error-text`)
    expect(contextIds).toEqual({
      control: state.ids?.control ?? state.id,
      label: state.ids?.label ?? `field::${state.id}::label`,
      helperText: state.ids?.helperText ?? `field::${state.id}::helper-text`,
      errorText: state.ids?.errorText ?? `field::${state.id}::error-text`,
    })
    return { root, input, label }
  }
  return { state, container, warnings, assertIds }
}

export function registerCustomIdTests() {
  describe.each(['input', 'textarea', 'select'] as const)('Field %s part IDs', (control) => {
    it.each(['default', 'root', 'control', 'both'] as const)('keeps %s ID overrides distinct through reactive updates', async (mode) => {
      const { state, container, assertIds } = await mount(control, mode)
      const { root, input, label } = assertIds()
      input.value = 'edited'
      input.dispatchEvent(new Event(control === 'select' ? 'change' : 'input', { bubbles: true }))
      await nextTick()
      expect(state.model).toBe('edited')
      for (const prefix of ['second', 'third']) {
        state.ids = partIds(mode, prefix)
        state.id = `${prefix}-seed`
        await nextTick()
        assertIds()
        expect(container.firstElementChild).toBe(root)
        expect(container.querySelector(control)).toBe(input)
        expect(container.querySelector('label')).toBe(label)
        expect(input.value).toBe('edited')
      }
      state.ids = undefined
      await nextTick()
      assertIds()
      expect(container.querySelector(control)).toBe(input)
      expect(input.value).toBe('edited')
    })

    it.each(['default', 'both'] as const)('hydrates %s IDs without replacing the control', async (mode) => {
      const { state, container, warnings, assertIds } = await mount(control, mode, true)
      const { root, input, label } = assertIds()
      input.value = 'edited'
      input.dispatchEvent(new Event(control === 'select' ? 'change' : 'input', { bubbles: true }))
      await nextTick()
      state.ids = partIds(mode, 'hydrated-update')
      state.id = 'updated-seed'
      await nextTick()
      assertIds()
      expect(container.firstElementChild).toBe(root)
      expect(container.querySelector(control)).toBe(input)
      expect(container.querySelector('label')).toBe(label)
      expect(input.value).toBe('edited')
      expect(warnings).toEqual([])
    })

    it('preserves explicit native control ID and label attributes over generated defaults', async () => {
      const { state, assertIds } = await mount(control, 'default', false, true)
      const { input, label } = assertIds()
      state.id = 'changed-seed'
      await nextTick()
      const current = assertIds()
      expect(current.input).toBe(input)
      expect(current.label).toBe(label)
    })
  })
}
