import type { Component, HTMLAttributes, VNode } from 'vue'
import * as core from '@destyler/select'
import { normalizeProps } from '@destyler/vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createApp, defineComponent, h, nextTick, shallowRef } from 'vue'
import { Select } from '../index'

type Send = Parameters<typeof core.connect>[1]
type MachineEvent = Parameters<Send>[0]
type Api = ReturnType<typeof connectedApi>
type ListenerKey = 'onClick' | 'onKeydown'
type ChildKind = 'none' | 'native' | 'component'

interface Control {
  name: string
  component: Component
  listenerKey: ListenerKey
  expected: MachineEvent | { preventScroll: boolean }
  getProps: (api: Api) => HTMLAttributes
}

const cleanups: Array<() => void> = []
afterEach(() => cleanups.splice(0).reverse().forEach(cleanup => cleanup()))

function mount(render: () => VNode, onError?: (error: unknown) => void) {
  const host = document.createElement('div')
  document.body.append(host)
  const app = createApp({ render })
  if (onError)
    app.config.errorHandler = onError
  app.mount(host)
  let mounted = true
  const cleanup = () => {
    if (mounted)
      app.unmount()
    mounted = false
    host.remove()
  }
  cleanups.push(cleanup)
  return { host, cleanup }
}

function connectedApi(send: Send) {
  // These are the published core 0.3.3 handlers, not replacement behavior.
  // No second machine is started: this suite isolates wrapper composition.
  return core.connect(core.machine({
    id: 'select-listener-contract',
    collection: core.collection({ items: ['vue', 'react'] }),
    defaultValue: ['vue'],
    defaultOpen: true,
  }).getState(), send, normalizeProps)
}

const controls: Control[] = [
  { name: 'Trigger click', component: Select.Trigger, listenerKey: 'onClick', expected: { type: 'TRIGGER.CLICK' }, getProps: api => api.getTriggerProps() },
  { name: 'Trigger keydown', component: Select.Trigger, listenerKey: 'onKeydown', expected: { type: 'TRIGGER.ARROW_DOWN' }, getProps: api => api.getTriggerProps() },
  { name: 'Content keydown', component: Select.Content, listenerKey: 'onKeydown', expected: { type: 'CONTENT.ARROW_DOWN' }, getProps: api => api.getContentProps() },
  { name: 'Item click', component: Select.Item, listenerKey: 'onClick', expected: { type: 'ITEM.CLICK', src: 'pointerup', value: 'react' }, getProps: api => api.getItemProps({ item: 'react' }) },
  { name: 'ClearTrigger click', component: Select.ClearTrigger, listenerKey: 'onClick', expected: 'CLEAR.CLICK', getProps: api => api.getClearTriggerProps() },
  { name: 'Label click', component: Select.Label, listenerKey: 'onClick', expected: { preventScroll: true }, getProps: api => api.getLabelProps() },
]

const childKinds: ChildKind[] = ['none', 'native', 'component']

const ForwardingChild = defineComponent({
  inheritAttrs: false,
  setup(_, { attrs, slots }) {
    return () => h('button', attrs, slots.default?.())
  },
})

function childTree(kind: Exclude<ChildKind, 'none'>, props: Record<string, unknown>, content: VNode | string = 'Child') {
  return kind === 'native' ? h('button', props, content) : h(ForwardingChild, props, () => content)
}

function controlTree(control: Control, props: Record<string, unknown>, child: () => VNode | string) {
  const renderControl = () => h(control.component, {
    ...(control.component === Select.Item ? { item: 'react' } : {}),
    'data-testid': 'control',
    ...props,
  }, child)
  // Content obtains its presence context from Positioner, not RootProvider.
  return control.component === Select.Content ? h(Select.Positioner, null, renderControl) : renderControl()
}

function dispatch(host: HTMLElement, control: Control, nested = false) {
  const target = host.querySelector<HTMLElement>(nested ? '[data-testid="nested"]' : '[data-testid="control"]')!
  expect(target).not.toBeNull()
  const event = control.listenerKey === 'onClick'
    ? new MouseEvent('click', { button: 0, bubbles: true, cancelable: true })
    : new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true })
  target.dispatchEvent(event)
  return event
}

function fixture(control: Control, order: string[] = []) {
  const send = vi.fn((_event: MachineEvent) => order.push('core'))
  const api = connectedApi(send)
  // Label performs focus rather than sending a machine event. Give its actual
  // DOM lookup the correct trigger ID and observe that real focus call.
  const trigger = document.createElement('button')
  trigger.id = String(api.getTriggerProps().id)
  if (control.component === Select.Label)
    document.body.append(trigger)
  const focus = vi.spyOn(trigger, 'focus').mockImplementation(() => {
    order.push('core')
  })
  cleanups.push(() => {
    focus.mockRestore()
    trigger.remove()
  })
  return { api, send, focus, effect: control.component === Select.Label ? focus : send }
}

function expectEffects(subject: ReturnType<typeof fixture>, control: Control, count: number) {
  expect(subject.effect).toHaveBeenCalledTimes(count)
  expect(subject.effect.mock.calls).toEqual(Array.from({ length: count }, () => [control.expected]))
  if (control.component === Select.Label)
    expect(subject.send).not.toHaveBeenCalled()
  else
    expect(subject.focus).not.toHaveBeenCalled()
}

function stableApi(base: Api) {
  const trigger = base.getTriggerProps()
  const content = base.getContentProps()
  const item = base.getItemProps({ item: 'react' })
  const clear = base.getClearTriggerProps()
  const label = base.getLabelProps()
  return {
    ...base,
    getTriggerProps: () => trigger,
    getContentProps: () => content,
    getItemProps: () => item,
    getClearTriggerProps: () => clear,
    getLabelProps: () => label,
  }
}

describe('select ordinary same-key listeners with connected core handlers', () => {
  for (const childKind of childKinds) {
    for (const cancellation of ['none', 'preventDefault', 'stopImmediatePropagation'] as const) {
      it.each(controls)(`${childKind}/${cancellation}: $name preserves caller-array order, vetoes and reactive replacement/removal`, async (control) => {
        const order: string[] = []
        const subject = fixture(control, order)
        const first = vi.fn((event: Event) => {
          order.push('first')
          if (cancellation !== 'none')
            event[cancellation]()
        })
        const second = vi.fn(() => order.push('second'))
        const child = vi.fn(() => order.push('child'))
        const replacement = vi.fn(() => order.push('replacement'))
        const replacementSecond = vi.fn(() => order.push('replacementSecond'))
        const listenerProps = shallowRef<Record<string, unknown>>({ [control.listenerKey]: [first, second] })
        const { host } = mount(() => h(Select.RootProvider, { value: subject.api }, () => controlTree(control, {
          asChild: childKind !== 'none',
          ...listenerProps.value,
        }, () => childKind === 'none' ? 'Control' : childTree(childKind, { [control.listenerKey]: child }))))
        dispatch(host, control)
        const expected = childKind === 'none' ? ['first'] : ['child', 'first']
        if (cancellation !== 'stopImmediatePropagation')
          expected.push('second')
        if (cancellation === 'none')
          expected.push('core')
        expect(order).toEqual(expected)
        expect(first).toHaveBeenCalledTimes(1)
        expect(second).toHaveBeenCalledTimes(cancellation === 'stopImmediatePropagation' ? 0 : 1)
        let effectCount = cancellation === 'none' ? 1 : 0
        expectEffects(subject, control, effectCount)
        for (const [props, expectedListeners] of [
          [{ [control.listenerKey]: replacement }, ['replacement']],
          [{ [control.listenerKey]: [replacement, replacementSecond] }, ['replacement', 'replacementSecond']],
          [{ [control.listenerKey]: null }, []],
          [{ [control.listenerKey]: undefined }, []],
          [{ [control.listenerKey]: [] }, []],
          [{}, []],
        ] as Array<[Record<string, unknown>, string[]]>) {
          listenerProps.value = props
          await nextTick()
          order.splice(0)
          dispatch(host, control)
          expect(order).toEqual([...(childKind === 'none' ? [] : ['child']), ...expectedListeners, 'core'])
          expectEffects(subject, control, ++effectCount)
        }
        expect(first).toHaveBeenCalledTimes(1)
        expect(replacement).toHaveBeenCalledTimes(2)
        expect(replacementSecond).toHaveBeenCalledTimes(1)
        expect(child).toHaveBeenCalledTimes(childKind === 'none' ? 0 : 7)
      })
    }

    for (const listenerKind of ['function', 'array-containing-core'] as const) {
      it.each(controls)(`${childKind}/${listenerKind}: $name deduplicates an identical stable core listener`, (control) => {
        const order: string[] = []
        const subject = fixture(control, order)
        const api = stableApi(subject.api)
        const props = control.getProps(api)
        const original = props[control.listenerKey]
        expect(typeof original).toBe('function')
        // Observe invocations too: keydown itself prevents default, which could
        // otherwise conceal a duplicate invocation by suppressing its send.
        const coreListener = vi.fn(original as (event: Event) => void)
        props[control.listenerKey] = coreListener
        const before = vi.fn(() => order.push('before'))
        const after = vi.fn(() => order.push('after'))
        const { host } = mount(() => h(Select.RootProvider, { value: api }, () => controlTree(control, {
          asChild: childKind !== 'none',
          [control.listenerKey]: listenerKind === 'function' ? coreListener : [before, coreListener, after],
        }, () => childKind === 'none' ? 'Control' : childTree(childKind, {}))))
        for (let count = 1; count <= 2; count++) {
          order.splice(0)
          dispatch(host, control)
          expect(coreListener).toHaveBeenCalledTimes(count)
          expect(order).toEqual(listenerKind === 'function' ? ['core'] : ['before', 'core', 'after'])
          expectEffects(subject, control, count)
        }
      })
    }

    for (const mode of ['sync', 'async'] as const) {
      it.each(controls)(`${childKind}/${mode}: $name routes caller errors through Vue and continues later listeners`, async (control) => {
        const order: string[] = []
        const subject = fixture(control, order)
        const failure = new Error('Expected caller failure')
        const errors = vi.fn()
        const fail = () => {
          order.push('first')
          throw failure
        }
        const first = mode === 'sync' ? fail : async () => fail()
        const second = vi.fn(() => order.push('second'))
        const { host } = mount(() => h(Select.RootProvider, { value: subject.api }, () => controlTree(control, {
          asChild: childKind !== 'none',
          [control.listenerKey]: [first, second],
        }, () => childKind === 'none' ? 'Control' : childTree(childKind, {}))), errors)
        dispatch(host, control)
        await nextTick()
        expect(errors).toHaveBeenCalledTimes(1)
        expect(errors.mock.calls[0][0]).toBe(failure)
        expect(order).toEqual(['first', 'second', 'core'])
        expect(second).toHaveBeenCalledTimes(1)
        expectEffects(subject, control, 1)
      })
    }

    it.each(controls)(`${childKind}: $name preserves current attrs, merged classes/styles, refs and cleanup`, async (control) => {
      const subject = fixture(control)
      const updated = shallowRef(false)
      const exposed = shallowRef<{ $el: Element } | null>(null)
      const childRef = shallowRef<HTMLElement | { $el: HTMLElement } | null>(null)
      const oldListener = vi.fn()
      const newListener = vi.fn()
      const { host, cleanup } = mount(() => h(Select.RootProvider, { value: subject.api }, () => controlTree(control, {
        'asChild': childKind !== 'none',
        'ref': exposed,
        'id': 'caller-control',
        'class': ['outer', { active: updated.value }],
        'style': [{ color: 'red' }, { backgroundColor: 'blue' }],
        'title': updated.value ? 'after' : 'before',
        'aria-label': 'Custom action',
        'data-custom': updated.value ? undefined : 'initial',
        [control.listenerKey]: updated.value ? newListener : oldListener,
      }, () => childKind === 'none'
        ? 'Control'
        : childTree(childKind, {
            key: updated.value ? 'after' : 'before',
            ref: childRef,
            class: 'inner',
            style: { padding: '4px' },
          }))))
      const target = () => host.querySelector<HTMLElement>('[data-testid="control"]')!
      const childElement = () => childRef.value && ('$el' in childRef.value ? childRef.value.$el : childRef.value)
      expect(exposed.value?.$el).toBe(target())
      expect(target().id).toBe('caller-control')
      expect(target().classList.contains('outer')).toBe(true)
      expect(target().style.color).toBe('red')
      expect(target().style.backgroundColor).toBe('blue')
      expect(target().getAttribute('aria-label')).toBe('Custom action')
      expect(target().getAttribute('data-scope')).toBe('select')
      expect(target().getAttribute('data-custom')).toBe('initial')
      if (childKind !== 'none') {
        expect(childElement()).toBe(target())
        expect(target().classList.contains('inner')).toBe(true)
        expect(target().style.padding).toBe('4px')
      }
      dispatch(host, control)
      expect(oldListener).toHaveBeenCalledTimes(1)
      expectEffects(subject, control, 1)
      updated.value = true
      await nextTick()
      expect(exposed.value?.$el).toBe(target())
      expect(target().getAttribute('title')).toBe('after')
      expect(target().hasAttribute('data-custom')).toBe(false)
      expect(target().classList.contains('active')).toBe(true)
      if (childKind !== 'none')
        expect(childElement()).toBe(target())
      dispatch(host, control)
      expect(oldListener).toHaveBeenCalledTimes(1)
      expect(newListener).toHaveBeenCalledTimes(1)
      expectEffects(subject, control, 2)
      cleanup()
      expect(exposed.value).toBeNull()
      expect(childRef.value).toBeNull()
      expect(host.isConnected).toBe(false)
    })
  }

  for (const childKind of ['native', 'component'] as const) {
    for (const cancellation of ['preventDefault', 'stopImmediatePropagation'] as const) {
      it.each(controls)(`${childKind}/${cancellation}: $name respects child arrays and child-listener replacement`, async (control) => {
        const order: string[] = []
        const subject = fixture(control, order)
        const caller = vi.fn(() => order.push('caller'))
        const veto = vi.fn((event: Event) => {
          order.push('childFirst')
          event[cancellation]()
        })
        const childSecond = vi.fn(() => order.push('childSecond'))
        const allowed = vi.fn(() => order.push('replacement'))
        const listenerProps = shallowRef<Record<string, unknown>>({ [control.listenerKey]: [veto, childSecond] })
        const { host } = mount(() => h(Select.RootProvider, { value: subject.api }, () => controlTree(control, {
          asChild: true,
          [control.listenerKey]: caller,
        }, () => childTree(childKind, listenerProps.value))))
        dispatch(host, control)
        expect(order).toEqual(cancellation === 'preventDefault' ? ['childFirst', 'childSecond', 'caller'] : ['childFirst'])
        expectEffects(subject, control, 0)
        listenerProps.value = { [control.listenerKey]: allowed }
        await nextTick()
        order.splice(0)
        dispatch(host, control)
        expect(order).toEqual(['replacement', 'caller', 'core'])
        expectEffects(subject, control, 1)
        listenerProps.value = {}
        await nextTick()
        order.splice(0)
        dispatch(host, control)
        expect(order).toEqual(['caller', 'core'])
        expectEffects(subject, control, 2)
        expect(veto).toHaveBeenCalledTimes(1)
        expect(allowed).toHaveBeenCalledTimes(1)
      })
    }

    it.each(controls)(`${childKind}: $name respects child-only stopImmediatePropagation without a wrapper listener`, async (control) => {
      const subject = fixture(control)
      const stopped = vi.fn((event: Event) => event.stopImmediatePropagation())
      const allowed = vi.fn()
      const listener = shallowRef<(event: Event) => void>(stopped)
      const { host } = mount(() => h(Select.RootProvider, { value: subject.api }, () => controlTree(control, {
        asChild: true,
      }, () => childTree(childKind, { [control.listenerKey]: listener.value }))))
      dispatch(host, control)
      expect(stopped).toHaveBeenCalledTimes(1)
      expectEffects(subject, control, 0)
      listener.value = allowed
      await nextTick()
      dispatch(host, control)
      expect(stopped).toHaveBeenCalledTimes(1)
      expect(allowed).toHaveBeenCalledTimes(1)
      expectEffects(subject, control, 1)
    })
  }
})

describe('select Content self-target keyboard semantics', () => {
  // In core 0.3.3 isSelfTarget means containment, not target === currentTarget.
  // Real bubbling descendants therefore navigate just like the content itself.
  it.each(childKinds)('%s: preserves core navigation for contained descendants and the content itself', (childKind) => {
    const control = controls.find(control => control.component === Select.Content)!
    const order: string[] = []
    const subject = fixture(control, order)
    const caller = vi.fn(() => order.push('caller'))
    const nested = () => h('span', { 'data-testid': 'nested' }, 'Nested target')
    const { host } = mount(() => h(Select.RootProvider, { value: subject.api }, () => controlTree(control, {
      asChild: childKind !== 'none',
      onKeydown: caller,
    }, () => childKind === 'none' ? nested() : childTree(childKind, {}, nested()))))
    const nestedEvent = dispatch(host, control, true)
    expect(nestedEvent.defaultPrevented).toBe(true)
    expect(order).toEqual(['caller', 'core'])
    expectEffects(subject, control, 1)
    order.splice(0)
    expect(dispatch(host, control).defaultPrevented).toBe(true)
    expect(order).toEqual(['caller', 'core'])
    expectEffects(subject, control, 2)
    expect(caller).toHaveBeenCalledTimes(2)
  })
})

describe('select native modifier-key limitation (not repaired by ordinary-listener composition)', () => {
  // onClickOnce/onKeydownOnce are distinct Vue keys, not ordinary same-key
  // listeners. Their registration order is unchanged; a wrapper .once veto
  // still happens after core on the first event. Capture/passive are likewise
  // outside this fix rather than silently rewritten into ordinary handlers.
  it.each(controls)('$name retains separate .once registration, so it cannot veto the preceding core action', async (control) => {
    const order: string[] = []
    const subject = fixture(control, order)
    const once = vi.fn((event: Event) => {
      order.push('once')
      event.preventDefault()
    })
    const { host } = mount(() => h(Select.RootProvider, { value: subject.api }, () => controlTree(control, {
      [`${control.listenerKey}Once`]: once,
    }, () => 'Control')))
    // Vue suppresses a distinct invoker in the attachment millisecond. Wait
    // for the actual clock boundary instead of changing event internals or
    // relying on a fixed sleep; the subsequent dispatch is a new native event.
    const attachedAt = Date.now()
    await vi.waitFor(() => expect(Date.now()).toBeGreaterThan(attachedAt), { interval: 1 })
    dispatch(host, control)
    expect(order).toEqual(['core', 'once'])
    expectEffects(subject, control, 1)
    dispatch(host, control)
    expect(order).toEqual(['core', 'once', 'core'])
    expectEffects(subject, control, 2)
    expect(once).toHaveBeenCalledTimes(1)
  })
})
