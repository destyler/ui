import type { Component, VNode } from 'vue'
import * as core from '@destyler/steps'
import { normalizeProps } from '@destyler/vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createApp, defineComponent, h, nextTick, shallowRef } from 'vue'
import { Steps } from '../index'

const cleanups: Array<() => void> = []
afterEach(() => cleanups.splice(0).forEach(cleanup => cleanup()))

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

const controls = [
  { name: 'Trigger', component: Steps.Trigger, expected: { type: 'STEP.SET', value: 2, src: 'trigger.click' } },
  { name: 'NextTrigger', component: Steps.NextTrigger, expected: { type: 'STEP.NEXT', src: 'next.trigger.click' } },
  { name: 'PrevTrigger', component: Steps.PrevTrigger, expected: { type: 'STEP.PREV', src: 'prev.trigger.click' } },
]

type Send = Parameters<typeof core.connect>[1]
type MachineEvent = Parameters<Send>[0]

function connectedApi(send: Send) {
  // The actual core click handlers, without starting a second machine.
  return core.connect(core.machine({ id: 'listener-contract', count: 3, defaultStep: 1 }).getState(), send, normalizeProps)
}

function controlTree(component: Component, props: Record<string, unknown>, child: () => VNode | string) {
  return h(Steps.Item, { index: 2 }, () => h(component, { 'data-testid': 'control', ...props }, child))
}

function dispatch(host: HTMLElement) {
  const target = host.querySelector<HTMLButtonElement>('[data-testid="control"]')!
  const event = new MouseEvent('click', { button: 0, bubbles: true, cancelable: true })
  target.dispatchEvent(event)
  return event
}

const ForwardingChild = defineComponent({
  inheritAttrs: false,
  setup(_, { attrs }) {
    return () => h('button', attrs, 'Child')
  },
})

function childTree(kind: 'native' | 'component', props: Record<string, unknown>) {
  return kind === 'native' ? h('button', props, 'Child') : h(ForwardingChild, props, () => 'Child')
}

describe('steps click listener composition with real connected core handlers', () => {
  for (const childKind of ['none', 'native', 'component'] as const) {
    for (const cancellation of ['none', 'preventDefault', 'stopImmediatePropagation'] as const) {
      it.each(controls)(`${childKind}/${cancellation}: runs $name caller arrays before core exactly once`, async (control) => {
        const order: string[] = []
        const send = vi.fn((_event: MachineEvent) => order.push('core'))
        const api = connectedApi(send)
        const first = vi.fn((event: Event) => {
          order.push('first')
          if (cancellation !== 'none')
            event[cancellation]()
        })
        const second = vi.fn(() => order.push('second'))
        const child = vi.fn(() => order.push('child'))
        const listeners = shallowRef<unknown>([first, second])
        const { host } = mount(() => h(Steps.RootProvider, { value: api }, () => controlTree(control.component, {
          asChild: childKind !== 'none',
          onClick: listeners.value,
        }, () => childKind === 'none' ? 'Control' : childTree(childKind, { onClick: child }))))
        dispatch(host)
        const expected = childKind === 'none' ? ['first'] : ['child', 'first']
        if (cancellation !== 'stopImmediatePropagation')
          expected.push('second')
        if (cancellation === 'none')
          expected.push('core')
        expect(order).toEqual(expected)
        expect(first).toHaveBeenCalledTimes(1)
        expect(second).toHaveBeenCalledTimes(cancellation === 'stopImmediatePropagation' ? 0 : 1)
        expect(send).toHaveBeenCalledTimes(cancellation === 'none' ? 1 : 0)
        if (cancellation === 'none')
          expect(send.mock.lastCall?.[0]).toEqual(control.expected)
        for (const replacement of [null, undefined, []]) {
          listeners.value = replacement
          await nextTick()
          order.splice(0)
          const previousCalls = send.mock.calls.length
          dispatch(host)
          expect(order).toEqual(childKind === 'none' ? ['core'] : ['child', 'core'])
          expect(send).toHaveBeenCalledTimes(previousCalls + 1)
          expect(send.mock.lastCall?.[0]).toEqual(control.expected)
        }
        expect(first).toHaveBeenCalledTimes(1)
      })
    }
  }

  for (const childKind of ['native', 'component'] as const) {
    it.each(controls)(`${childKind}: $name asChild veto survives child listener replacement`, async (control) => {
      const order: string[] = []
      const send = vi.fn((_event: MachineEvent) => order.push('core'))
      const api = connectedApi(send)
      const consumer = vi.fn(() => order.push('consumer'))
      const veto = vi.fn((event: MouseEvent) => {
        order.push('child')
        event.preventDefault()
      })
      const allowed = vi.fn(() => order.push('replacement'))
      const listener = shallowRef<(event: MouseEvent) => void>(veto)
      const { host } = mount(() => h(Steps.RootProvider, { value: api }, () => controlTree(control.component, {
        asChild: true,
        onClick: consumer,
      }, () => childTree(childKind, { onClick: listener.value }))))
      expect(dispatch(host).defaultPrevented).toBe(true)
      expect(send).not.toHaveBeenCalled()
      expect(order).toEqual(['child', 'consumer'])
      expect(consumer).toHaveBeenCalledTimes(1)
      expect(veto).toHaveBeenCalledTimes(1)
      listener.value = allowed
      await nextTick()
      order.splice(0)
      dispatch(host)
      dispatch(host)
      expect(order).toEqual(['replacement', 'consumer', 'core', 'replacement', 'consumer', 'core'])
      expect(send).toHaveBeenCalledTimes(2)
      expect(send.mock.calls.map(call => call[0])).toEqual([control.expected, control.expected])
      expect(veto).toHaveBeenCalledTimes(1)
      expect(allowed).toHaveBeenCalledTimes(2)
    })

    it.each(controls)(`${childKind}: $name honors child-only stopImmediatePropagation without a wrapper listener`, async (control) => {
      const send = vi.fn()
      const api = connectedApi(send)
      const stopped = vi.fn((event: MouseEvent) => event.stopImmediatePropagation())
      const allowed = vi.fn()
      const listener = shallowRef<(event: MouseEvent) => void>(stopped)
      const { host } = mount(() => h(Steps.RootProvider, { value: api }, () => controlTree(control.component, {
        asChild: true,
      }, () => childTree(childKind, { onClick: listener.value }))))
      dispatch(host)
      expect(stopped).toHaveBeenCalledTimes(1)
      expect(send).not.toHaveBeenCalled()
      listener.value = allowed
      await nextTick()
      dispatch(host)
      expect(stopped).toHaveBeenCalledTimes(1)
      expect(allowed).toHaveBeenCalledTimes(1)
      expect(send).toHaveBeenCalledExactlyOnceWith(control.expected)
    })
  }

  for (const childKind of ['native', 'component'] as const) {
    it.each(controls)(`${childKind}: $name child-only onClickOnce vetoes only the first click before core`, (control) => {
      const order: string[] = []
      const send = vi.fn((_event: MachineEvent) => order.push('core'))
      const api = connectedApi(send)
      const once = vi.fn((event: MouseEvent) => {
        order.push('once')
        event.preventDefault()
      })
      const { host } = mount(() => h(Steps.RootProvider, { value: api }, () => controlTree(control.component, {
        asChild: true,
      }, () => childTree(childKind, { onClickOnce: once }))))
      expect(dispatch(host).defaultPrevented).toBe(true)
      expect(once).toHaveBeenCalledTimes(1)
      expect(send).not.toHaveBeenCalled()
      expect(order).toEqual(['once'])
      expect(dispatch(host).defaultPrevented).toBe(false)
      expect(once).toHaveBeenCalledTimes(1)
      expect(send).toHaveBeenCalledExactlyOnceWith(control.expected)
      expect(order).toEqual(['once', 'core'])
      dispatch(host)
      expect(once).toHaveBeenCalledTimes(1)
      expect(send.mock.calls.map(call => call[0])).toEqual([control.expected, control.expected])
      expect(order).toEqual(['once', 'core', 'core'])
    })
  }

  for (const asChild of [false, true]) {
    for (const listenerKind of ['function', 'array'] as const) {
      it.each(controls)(`asChild=${asChild}/${listenerKind}: $name deduplicates a caller identical to its stable core listener`, (control) => {
        const send = vi.fn()
        const base = connectedApi(send)
        const triggerProps = base.getTriggerProps({ index: 2 })
        const nextProps = base.getNextTriggerProps()
        const prevProps = base.getPrevTriggerProps()
        const api = {
          ...base,
          getTriggerProps: () => triggerProps,
          getNextTriggerProps: () => nextProps,
          getPrevTriggerProps: () => prevProps,
        }
        const coreProps = control.component === Steps.Trigger ? triggerProps : control.component === Steps.NextTrigger ? nextProps : prevProps
        const listener = coreProps.onClick
        expect(typeof listener).toBe('function')
        const { host } = mount(() => h(Steps.RootProvider, { value: api }, () => controlTree(control.component, {
          asChild,
          onClick: listenerKind === 'array' ? [listener] : listener,
        }, () => asChild ? h('button', 'Child') : 'Control')))
        dispatch(host)
        expect(send).toHaveBeenCalledExactlyOnceWith(control.expected)
        dispatch(host)
        expect(send.mock.calls.map(call => call[0])).toEqual([control.expected, control.expected])
      })
    }

    for (const mode of ['sync', 'async'] as const) {
      it.each(controls)(`asChild=${asChild}/${mode}: $name preserves Vue error handling without skipping later listeners`, async (control) => {
        const order: string[] = []
        const failure = new Error('Expected caller failure')
        const errors = vi.fn()
        const send = vi.fn((_event: MachineEvent) => order.push('core'))
        const api = connectedApi(send)
        const fail = () => {
          order.push('first')
          throw failure
        }
        const first = mode === 'sync' ? fail : async () => fail()
        const second = vi.fn(() => order.push('second'))
        const { host } = mount(() => h(Steps.RootProvider, { value: api }, () => controlTree(control.component, {
          asChild,
          onClick: [first, second],
        }, () => asChild ? h('button', 'Child') : 'Control')), errors)
        dispatch(host)
        await vi.waitFor(() => expect(errors).toHaveBeenCalledTimes(1))
        expect(errors.mock.calls[0][0]).toBe(failure)
        expect(order).toEqual(['first', 'second', 'core'])
        expect(second).toHaveBeenCalledTimes(1)
        expect(send).toHaveBeenCalledExactlyOnceWith(control.expected)
      })
    }

    it.each(controls)(`asChild=${asChild}: $name preserves attrs, classes, refs and cleanup`, async (control) => {
      const send = vi.fn()
      const api = connectedApi(send)
      const updated = shallowRef(false)
      const exposed = shallowRef<{ $el: Element } | null>(null)
      const childRef = shallowRef<HTMLElement | null>(null)
      const oldListener = vi.fn()
      const newListener = vi.fn()
      const { host, cleanup } = mount(() => h(Steps.RootProvider, { value: api }, () => controlTree(control.component, {
        'asChild': asChild,
        'ref': exposed,
        'class': ['outer', { active: updated.value }],
        'style': [{ color: 'red' }, { backgroundColor: 'blue' }],
        'title': updated.value ? 'after' : 'before',
        'aria-label': 'Custom action',
        'data-custom': updated.value ? undefined : 'initial',
        'onClick': updated.value ? newListener : oldListener,
      }, () => asChild ? h('button', { key: updated.value ? 'after' : 'before', ref: childRef, class: 'inner' }, 'Child') : 'Control')))
      const target = () => host.querySelector<HTMLButtonElement>('[data-testid="control"]')!
      expect(exposed.value?.$el).toBe(target())
      expect(target().classList.contains('outer')).toBe(true)
      expect(target().style.color).toBe('red')
      expect(target().style.backgroundColor).toBe('blue')
      expect(target().getAttribute('aria-label')).toBe('Custom action')
      expect(target().getAttribute('type')).toBe('button')
      expect(target().getAttribute('data-scope')).toBe('steps')
      expect(target().getAttribute('data-custom')).toBe('initial')
      if (asChild) {
        expect(childRef.value).toBe(target())
        expect(target().classList.contains('inner')).toBe(true)
      }
      dispatch(host)
      expect(oldListener).toHaveBeenCalledTimes(1)
      expect(send).toHaveBeenCalledTimes(1)
      updated.value = true
      await nextTick()
      expect(exposed.value?.$el).toBe(target())
      expect(target().getAttribute('title')).toBe('after')
      expect(target().hasAttribute('data-custom')).toBe(false)
      expect(target().classList.contains('active')).toBe(true)
      if (asChild)
        expect(childRef.value).toBe(target())
      dispatch(host)
      expect(oldListener).toHaveBeenCalledTimes(1)
      expect(newListener).toHaveBeenCalledTimes(1)
      expect(send).toHaveBeenCalledTimes(2)
      cleanup()
      expect(exposed.value).toBeNull()
      expect(childRef.value).toBeNull()
      expect(host.isConnected).toBe(false)
    })
  }
})

describe('steps Trigger keyboard wiring only (not core keyboard functionality)', () => {
  it.each(['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp'])('allows a caller to veto a supplied %s handler before movement', async (key) => {
    // This deliberately supplied provider handler tests wrapper composition,
    // not the actual core keyboard navigation implementation.
    const order: string[] = []
    const movement = vi.fn((_key: string) => order.push('movement'))
    const base = connectedApi(vi.fn())
    const api = {
      ...base,
      getTriggerProps(props: Parameters<typeof base.getTriggerProps>[0]) {
        return {
          ...base.getTriggerProps(props),
          onKeydown(event: KeyboardEvent) {
            if (event.defaultPrevented)
              return
            movement(event.key)
          },
        }
      },
    }
    const blocked = vi.fn((event: KeyboardEvent) => {
      order.push('caller')
      event.preventDefault()
    })
    const allowed = vi.fn(() => order.push('replacement'))
    const listener = shallowRef<(event: KeyboardEvent) => void>(blocked)
    const { host } = mount(() => h(Steps.RootProvider, { value: api }, () => controlTree(Steps.Trigger, { onKeydown: listener.value }, () => 'Control')))
    const keydown = () => host.querySelector('[data-testid="control"]')!.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }))
    keydown()
    expect(order).toEqual(['caller'])
    expect(movement).not.toHaveBeenCalled()
    listener.value = allowed
    await nextTick()
    order.splice(0)
    keydown()
    expect(order).toEqual(['replacement', 'movement'])
    expect(movement).toHaveBeenCalledExactlyOnceWith(key)
    expect(blocked).toHaveBeenCalledTimes(1)
    expect(allowed).toHaveBeenCalledTimes(1)
  })
})
