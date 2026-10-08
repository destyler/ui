import type { Component } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createApp, createSSRApp, defineComponent, h, nextTick, reactive, shallowRef } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { Fieldset } from '~/components/fieldset'
import { Field } from '../index'

type Kind = 'field' | 'fieldset'
interface Options { asChild?: boolean, hydrate?: boolean, doc?: Document, text?: boolean, invalid?: boolean }
const disposers: (() => void)[] = []
async function settle() {
  await nextTick()
  await new Promise(resolve => setTimeout(resolve, 0))
  await nextTick()
}

afterEach(async () => {
  disposers.splice(0).forEach(dispose => dispose())
  await settle()
  document.body.replaceChildren()
  vi.restoreAllMocks()
})

async function mount(kind: Kind, options: Options = {}) {
  const { asChild = false, hydrate = false, doc = document, text = true, invalid = true } = options
  const state = reactive({
    id: 'first',
    disabled: false,
    invalid,
    model: 'initial',
    helper: text,
    error: text,
    hostVersion: 0,
    ids: undefined as { helperText?: string, errorText?: string } | undefined,
  })
  const exposed = shallowRef<any>()
  const parts = kind === 'field' ? Field : Fieldset
  const Host = defineComponent({
    props: { version: Number },
    setup: (props, { slots }) => () => h(kind === 'field' ? 'section' : 'fieldset', { key: props.version }, slots.default?.()),
  })
  const children = () => [
    h(kind === 'field' ? Field.Label : Fieldset.Legend, null, () => 'Name'),
    kind === 'field'
      ? h(Field.Input, { 'asChild': hydrate, 'modelValue': state.model, 'onUpdate:modelValue': (value: string) => { state.model = value } }, hydrate ? () => h('input') : undefined)
      : h('input', { value: state.model, onInput: (event: Event) => { state.model = (event.target as HTMLInputElement).value } }),
    state.helper && h(parts.HelperText, null, () => 'Help'),
    state.error && h(parts.ErrorText, null, () => 'Error'),
  ]
  const Fixture = defineComponent({
    setup: () => () => h(parts.Root as Component, {
      ref: exposed,
      id: state.id,
      disabled: state.disabled,
      invalid: state.invalid,
      asChild,
      ...(kind === 'field' ? { ids: state.ids } : {}),
    }, () => asChild ? h(Host, { version: state.hostVersion }, children) : children()),
  })
  const container = doc.createElement('div')
  doc.body.append(container)
  let serverRoot: Element | null = null
  let serverInput: HTMLInputElement | null = null
  if (hydrate) {
    const observe = vi.spyOn(window.MutationObserver.prototype, 'observe')
    const calls = observe.mock.calls.length
    container.innerHTML = await renderToString(createSSRApp(Fixture))
    expect(observe).toHaveBeenCalledTimes(calls)
    serverRoot = container.firstElementChild
    serverInput = container.querySelector('input')
    const target = kind === 'field' ? serverInput : serverRoot
    // Description presence remains DOM-observed; server-only linkage is not claimed.
    expect(target!.getAttribute('aria-describedby') || '').toBe('')
  }
  const app = (hydrate ? createSSRApp : createApp)(Fixture)
  const warnings: string[] = []
  app.config.warnHandler = warning => warnings.push(warning)
  app.mount(container)
  let active = true
  const dispose = () => {
    if (!active)
      return
    active = false
    app.unmount()
    container.remove()
  }
  disposers.push(dispose)
  await settle()
  if (hydrate) {
    expect(container.firstElementChild).toBe(serverRoot)
    expect(container.querySelector('input')).toBe(serverInput)
  }
  expect(warnings).toEqual([])
  return { state, container, exposed, warnings, dispose }
}

function assertDescription(kind: Kind, container: HTMLElement, helper: boolean, error: boolean) {
  const target = kind === 'field' ? container.querySelector('input')! : container.firstElementChild!
  const helperNode = container.querySelector<HTMLElement>('[data-part="helper-text"]')
  const errorNode = container.querySelector<HTMLElement>('[data-part="error-text"]')
  const ids = [error && errorNode!.id, helper && helperNode!.id].filter(Boolean)
  expect(target.getAttribute('aria-describedby') || '').toBe(ids.join(' '))
  for (const id of ids)
    expect(container.ownerDocument.getElementById(id as string)).not.toBeNull()
}

export function registerDescriptionLifecycleTests() {
  describe.each(['field', 'fieldset'] as const)('%s reactive description lifecycle', (kind) => {
    it.each([
      { asChild: false, hydrate: false },
      { asChild: true, hydrate: false },
      { asChild: false, hydrate: true },
      { asChild: true, hydrate: true },
    ])('keeps post-update linkage and DOM identity (asChild=$asChild, hydrate=$hydrate)', async (options) => {
      const { state, container, exposed, warnings } = await mount(kind, options)
      const root = container.firstElementChild
      const input = container.querySelector('input')!
      const helper = container.querySelector('[data-part="helper-text"]')!
      const error = container.querySelector('[data-part="error-text"]')!
      expect(exposed.value.$el).toBe(root)
      assertDescription(kind, container, true, true)
      input.value = 'edited'
      input.dispatchEvent(new Event('input', { bubbles: true }))
      await settle()
      for (const id of ['second', 'third']) {
        state.id = id
        await settle()
        expect(container.firstElementChild).toBe(root)
        expect(container.querySelector('input')).toBe(input)
        expect(container.querySelector('[data-part="helper-text"]')).toBe(helper)
        expect(container.querySelector('[data-part="error-text"]')).toBe(error)
        expect(helper.id).toBe(`${kind}::${id}::helper-text`)
        expect(error.id).toBe(`${kind}::${id}::error-text`)
        expect(input.value).toBe('edited')
        expect(exposed.value.$el).toBe(root)
        assertDescription(kind, container, true, true)
      }
      if (kind === 'field') {
        for (const prefix of ['custom-one', 'custom-two']) {
          state.ids = { helperText: `${prefix}-helper`, errorText: `${prefix}-error` }
          await settle()
          expect(container.querySelector('[data-part="helper-text"]')).toBe(helper)
          expect(container.querySelector('[data-part="error-text"]')).toBe(error)
          expect(helper.id).toBe(`${prefix}-helper`)
          expect(error.id).toBe(`${prefix}-error`)
          assertDescription(kind, container, true, true)
        }
      }
      for (const invalid of [false, true]) {
        state.invalid = invalid
        state.disabled = invalid
        await settle()
        assertDescription(kind, container, true, invalid)
        const disabledTarget = kind === 'field' ? input : root as HTMLFieldSetElement
        expect(disabledTarget!.disabled).toBe(invalid)
        expect(exposed.value.disabled).toBe(invalid)
      }
      for (const [helperPresent, errorPresent] of [[false, true], [false, false], [true, false], [true, true]]) {
        state.helper = helperPresent
        state.error = errorPresent
        await settle()
        assertDescription(kind, container, helperPresent, errorPresent)
      }
      expect(warnings).toEqual([])
      expect(input.value).toBe('edited')
    })

    it('rebinds an asChild host replacement and disconnects before queued unmount delivery', async () => {
      const NativeObserver = window.MutationObserver
      const deliveries = vi.fn()
      function ObserveDeliveries(callback: MutationCallback) {
        return new NativeObserver((records, observer) => {
          deliveries()
          callback(records, observer)
        })
      }
      vi.spyOn(window, 'MutationObserver').mockImplementation(ObserveDeliveries)
      const observe = vi.spyOn(NativeObserver.prototype, 'observe')
      const disconnect = vi.spyOn(NativeObserver.prototype, 'disconnect')
      const { state, container, exposed, dispose } = await mount(kind, { asChild: true })
      const first = container.firstElementChild!
      expect(observe).toHaveBeenCalledExactlyOnceWith(first, { childList: true, subtree: true })
      const firstObserver = observe.mock.contexts[0]
      state.id = 'replacement-id'
      await settle()
      expect(observe).toHaveBeenCalledTimes(2)
      expect(disconnect).toHaveBeenCalledTimes(1)
      expect(disconnect.mock.contexts[0]).toBe(firstObserver)
      expect(observe.mock.calls[1][0]).toBe(first)
      state.hostVersion++
      await settle()
      const second = container.firstElementChild!
      expect(second).not.toBe(first)
      expect(first.isConnected).toBe(false)
      expect(exposed.value.$el).toBe(second)
      expect(observe).toHaveBeenCalledTimes(3)
      expect(observe.mock.calls[2]).toEqual([second, { childList: true, subtree: true }])
      expect(disconnect).toHaveBeenCalledTimes(2)
      assertDescription(kind, container, true, true)
      const count = deliveries.mock.calls.length
      second.append(document.createTextNode('queued before unmount'))
      dispose()
      second.append(document.createTextNode('after unmount'))
      await settle()
      expect(deliveries).toHaveBeenCalledTimes(count)
      expect(disconnect).toHaveBeenCalledTimes(3)
      expect(disconnect.mock.contexts[2]).toBe(observe.mock.contexts[2])
      expect(exposed.value).toBeNull()
    })

    it('uses the owner document and does not link colliding IDs in the outer document', async () => {
      const iframe = document.createElement('iframe')
      document.body.append(iframe)
      const doc = iframe.contentDocument!
      const outer = document.createElement('span')
      outer.id = `${kind}::first::helper-text`
      document.body.append(outer)
      const { state, container, dispose } = await mount(kind, { doc, text: false })
      assertDescription(kind, container, false, false)
      state.helper = true
      state.error = true
      await settle()
      expect(container.firstElementChild!.ownerDocument).toBe(doc)
      assertDescription(kind, container, true, true)
      state.helper = false
      state.error = false
      await settle()
      assertDescription(kind, container, false, false)
      dispose()
      iframe.remove()
    })

    it('hydrates initially valid text and follows invalid transitions', async () => {
      const { state, container } = await mount(kind, { hydrate: true, invalid: false })
      const root = container.firstElementChild
      const input = container.querySelector('input')
      assertDescription(kind, container, true, false)
      for (const invalid of [true, false, true]) {
        state.invalid = invalid
        await settle()
        assertDescription(kind, container, true, invalid)
        expect(container.firstElementChild).toBe(root)
        expect(container.querySelector('input')).toBe(input)
      }
    })

    it('does not invent description IDs for absent text', async () => {
      const { container } = await mount(kind, { text: false })
      assertDescription(kind, container, false, false)
    })
  })

  it.each(['disabled', 'invalid', 'id'] as const)('updates Fieldset %s without remounting or unrelated changes', async (key) => {
    const { state, container } = await mount('fieldset', { invalid: false })
    const root = container.firstElementChild
    if (key === 'id')
      state.id = 'fresh'
    else state[key] = true
    await settle()
    expect(container.firstElementChild).toBe(root)
    if (key === 'disabled')
      expect((root as HTMLFieldSetElement).disabled).toBe(true)
    else if (key === 'invalid')
      expect(container.querySelector('[data-part="error-text"]')).not.toBeNull()
    else expect(container.querySelector('[data-part="helper-text"]')!.id).toBe('fieldset::fresh::helper-text')
  })

  it('preserves existing Field flag reactivity as a baseline control', async () => {
    const { state, container } = await mount('field')
    state.disabled = true
    state.invalid = true
    await settle()
    expect(container.querySelector('input')!.disabled).toBe(true)
    expect(container.querySelector('[data-part="error-text"]')).not.toBeNull()
  })
}
