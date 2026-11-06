import type { Component, ComponentOptions, PropType, VNode } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createApp, defineComponent, h, nextTick, shallowRef } from 'vue'
import { useNativeEventProps } from '~/composables/use-native-event-props'
import { ui } from '~/factory'
import { useStepsTriggerProps } from '../../components/steps/composables/use-steps-trigger-props'

const cleanups: Array<() => void> = []
afterEach(() => cleanups.splice(0).forEach(cleanup => cleanup()))

function fixture(core: (event: Event) => unknown, attrs: Record<string, unknown> = {}, child?: () => VNode, globalMixin?: ComponentOptions) {
  const Part = defineComponent({
    inheritAttrs: false,
    setup() {
      const props = useStepsTriggerProps(() => ({ onClick: core }))
      return () => h(ui.button as Component, { ...props(), asChild: !!child }, () => child ? child() : 'Control')
    },
  })
  const host = document.createElement('div')
  document.body.append(host)
  const app = createApp(() => h(Part, attrs))
  const errors = vi.fn()
  app.config.errorHandler = errors
  if (globalMixin)
    app.mixin(globalMixin)
  app.mount(host)
  cleanups.push(() => {
    app.unmount()
    host.remove()
  })
  return { host, errors }
}

function click(target: Element) {
  const event = new MouseEvent('click', { bubbles: true, cancelable: true })
  target.dispatchEvent(event)
  return event
}

async function clockBoundary() {
  await nextTick()
  const now = Date.now()
  await vi.waitFor(() => expect(Date.now()).toBeGreaterThan(now), { interval: 1 })
}

const ForwardingChild = defineComponent({
  inheritAttrs: false,
  setup(_, { attrs }) {
    return () => h('button', attrs, 'Child')
  },
})

const AdaptedChild = defineComponent({
  inheritAttrs: false,
  setup(_, { attrs }) {
    const nativeProps = useNativeEventProps()
    return () => h('button', nativeProps(attrs), 'Child')
  },
})

function childTree(kind: 'native' | 'adapted', props: Record<string, unknown>) {
  return kind === 'native' ? h('button', props, 'Child') : h(AdaptedChild, props)
}

describe('once component boundaries without native opt-in', () => {
  for (const declaration of ['direct', 'extends', 'mixins', 'global mixin', 'undeclared'] as const) {
    it.each(['none', 'string', 'event'] as const)(`${declaration}: preserves component Once with %s payload across DOM targets`, async (payload) => {
      const inherited: ComponentOptions = { emits: { click: null } }
      const Child = defineComponent({
        inheritAttrs: false,
        ...(declaration === 'direct' ? { emits: ['click'] } : {}),
        ...(declaration === 'extends' ? { extends: inherited } : {}),
        ...(declaration === 'mixins' ? { mixins: [{ extends: inherited }] } : {}),
        setup(_, { emit }) {
          return () => h('div', ['first', 'second'].map(label => h('button', {
            onClick(event: MouseEvent) {
              if (payload === 'none')
                emit('click')
              else
                emit('click', payload === 'string' ? label : event)
            },
          }, label)))
        },
      })
      const once = vi.fn()
      const core = vi.fn()
      const { host, errors } = fixture(core, {}, () => h(Child, { onClickOnce: once }), declaration === 'global mixin' ? inherited : undefined)
      await clockBoundary()
      const [first, second] = host.querySelectorAll('button')
      const event = click(first)
      expect(once.mock.calls).toEqual([payload === 'none' ? [] : [payload === 'string' ? 'first' : event]])
      click(second)
      click(first)
      expect(once).toHaveBeenCalledTimes(1)
      expect(errors).not.toHaveBeenCalled()
      // Global emits also consume attrs on intermediate factory components.
      if (declaration !== 'global mixin')
        expect(core).toHaveBeenCalledTimes(3)
    })
  }

  it('preserves an explicit callback prop reference and component-defined invocation semantics', async () => {
    const callback = vi.fn()
    const received = vi.fn()
    const Child = defineComponent({
      inheritAttrs: false,
      props: { onClickOnce: Function as PropType<(payload: string) => void> },
      setup(props) {
        received(props.onClickOnce)
        return () => h('div', ['first', 'second'].map(label => h('button', {
          onClick: () => props.onClickOnce?.(label),
        }, label)))
      },
    })
    const { host, errors } = fixture(vi.fn(), {}, () => h(Child, { onClickOnce: callback }))
    await clockBoundary()
    expect(received).toHaveBeenCalledExactlyOnceWith(callback)
    const [first, second] = host.querySelectorAll('button')
    click(first)
    click(second)
    click(first)
    expect(callback.mock.calls).toEqual([['first'], ['second'], ['first']])
    expect(errors).not.toHaveBeenCalled()
  })

  it('preserves undeclared emit arguments and component Once consumption across removal and readdition', async () => {
    const detail = { source: 'child' }
    const Child = defineComponent({
      inheritAttrs: false,
      setup(_, { emit }) {
        return () => h('button', { onClick: () => emit('click', 'payload', 42, detail) }, 'Emit')
      },
    })
    const first = vi.fn()
    const replacement = vi.fn()
    const listener = shallowRef(first)
    const enabled = shallowRef(true)
    const core = vi.fn()
    const { host, errors } = fixture(core, {}, () => h(Child, enabled.value ? { onClickOnce: listener.value } : {}))
    await clockBoundary()
    const target = host.querySelector('button')!
    click(target)
    expect(first).toHaveBeenCalledExactlyOnceWith('payload', 42, detail)
    enabled.value = false
    await clockBoundary()
    click(target)
    listener.value = replacement
    enabled.value = true
    await clockBoundary()
    expect(host.querySelector('button')).toBe(target)
    click(target)
    expect(first).toHaveBeenCalledTimes(1)
    expect(replacement).not.toHaveBeenCalled()
    expect(core.mock.calls).toEqual(Array.from({ length: 3 }, () => ['payload', 42, detail]))
    expect(errors).not.toHaveBeenCalled()
  })

  it('retains the unadapted forwarding limitation while a stopped ordinary listener leaves native Once unconsumed', async () => {
    const order: string[] = []
    let stopped = true
    const once = vi.fn((event: Event) => {
      order.push('once')
      event.preventDefault()
    })
    const { host, errors } = fixture(() => order.push('core'), {
      onClick(event: Event) {
        order.push('consumer')
        if (stopped)
          event.stopImmediatePropagation()
      },
      onClickOnce: once,
    }, () => h(ForwardingChild))
    await clockBoundary()
    const target = host.querySelector('button')!
    click(target)
    expect(order).toEqual(['consumer'])
    expect(once).not.toHaveBeenCalled()
    stopped = false
    expect(click(target).defaultPrevented).toBe(true)
    expect(order).toEqual(['consumer', 'consumer', 'core', 'once'])
    expect(click(target).defaultPrevented).toBe(false)
    expect(order).toEqual(['consumer', 'consumer', 'core', 'once', 'consumer', 'core'])
    expect(once).toHaveBeenCalledTimes(1)
    expect(errors).not.toHaveBeenCalled()
  })

  it('keeps unadapted ordinary/core-before-Once order and skips falsy listener-array entries', async () => {
    const order: string[] = []
    const falsy = [null, undefined, false, 0, '']
    const { host, errors } = fixture(() => order.push('core'), {
      onClick: [...falsy, () => order.push('wrapper')],
      onClickOnce: [...falsy, () => order.push('wrapper-once')],
    }, () => h(ForwardingChild, {
      onClick: [...falsy, () => order.push('child')],
      onClickOnce: [...falsy, () => order.push('child-once')],
    }))
    await clockBoundary()
    const target = host.querySelector('button')!
    click(target)
    expect(order).toEqual(['child', 'wrapper', 'core', 'child-once', 'wrapper-once'])
    click(target)
    expect(order).toEqual(['child', 'wrapper', 'core', 'child-once', 'wrapper-once', 'child', 'wrapper', 'core'])
    expect(errors).not.toHaveBeenCalled()
  })
})

describe('native and explicitly adapted Once receivers', () => {
  it('preserves constituent Once callbacks through an unmarked nested ui asChild layer', async () => {
    const order: string[] = []
    const failure = new Error('expected innermost Once failure')
    const innerOnce = vi.fn(() => {
      order.push('inner')
      throw failure
    })
    const middleOnce = vi.fn(() => order.push('middle'))
    const wrapperOnce = vi.fn(() => order.push('wrapper'))
    const core = vi.fn(() => order.push('core'))
    const middleMarkers: boolean[] = []
    const Middle = defineComponent({
      inheritAttrs: false,
      setup(_, { attrs }) {
        middleMarkers.push(Object.hasOwn(attrs, '__uiComposeOnce'))
        return () => h(ui.button as Component, { ...attrs, asChild: true }, () => h(AdaptedChild, { onClickOnce: innerOnce }))
      },
    })
    const { host, errors } = fixture(core, { onClickOnce: wrapperOnce }, () => h(Middle, { onClickOnce: middleOnce }))
    await clockBoundary()
    expect(middleMarkers).toEqual([false])
    const target = host.querySelector('button')!
    click(target)
    await vi.waitFor(() => expect(errors).toHaveBeenCalledTimes(1))
    expect(errors.mock.calls[0][0]).toBe(failure)
    expect(order).toEqual(['inner', 'middle', 'wrapper', 'core'])
    expect(innerOnce).toHaveBeenCalledTimes(1)
    expect(middleOnce).toHaveBeenCalledTimes(1)
    expect(wrapperOnce).toHaveBeenCalledTimes(1)
    click(target)
    await nextTick()
    expect(order).toEqual(['inner', 'middle', 'wrapper', 'core', 'core'])
    expect(innerOnce).toHaveBeenCalledTimes(1)
    expect(middleOnce).toHaveBeenCalledTimes(1)
    expect(wrapperOnce).toHaveBeenCalledTimes(1)
    expect(core).toHaveBeenCalledTimes(2)
    expect(errors).toHaveBeenCalledTimes(1)
  })

  it.each(['sync', 'async'] as const)('adapted: separately supplied child and wrapper Once functions preserve %s errors', async (mode) => {
    const order: string[] = []
    const childFailure = new Error('expected child function failure')
    const wrapperFailure = new Error('expected wrapper function failure')
    function failing(label: string, failure: Error) {
      const fail = () => {
        order.push(label)
        throw failure
      }
      return vi.fn(mode === 'sync' ? fail : async () => fail())
    }
    const childOnce = failing('child', childFailure)
    const wrapperOnce = failing('wrapper', wrapperFailure)
    const core = vi.fn(() => order.push('core'))
    const { host, errors } = fixture(core, { onClickOnce: wrapperOnce }, () => h(AdaptedChild, { onClickOnce: childOnce }))
    await clockBoundary()
    const target = host.querySelector('button')!
    click(target)
    await vi.waitFor(() => expect(errors).toHaveBeenCalledTimes(2))
    expect(errors.mock.calls.map(call => call[0])).toEqual([childFailure, wrapperFailure])
    expect(order).toEqual(['child', 'wrapper', 'core'])
    expect(childOnce).toHaveBeenCalledTimes(1)
    expect(wrapperOnce).toHaveBeenCalledTimes(1)
    click(target)
    await nextTick()
    expect(order).toEqual(['child', 'wrapper', 'core', 'core'])
    expect(errors).toHaveBeenCalledTimes(2)
    expect(core).toHaveBeenCalledTimes(2)
  })

  it('adapted: separately supplied child Once stopImmediatePropagation suppresses wrapper Once and core', async () => {
    const childOnce = vi.fn((event: Event) => event.stopImmediatePropagation())
    const wrapperOnce = vi.fn()
    const core = vi.fn()
    const { host, errors } = fixture(core, { onClickOnce: wrapperOnce }, () => h(AdaptedChild, { onClickOnce: childOnce }))
    await clockBoundary()
    const target = host.querySelector('button')!
    click(target)
    expect(childOnce).toHaveBeenCalledTimes(1)
    expect(wrapperOnce).not.toHaveBeenCalled()
    expect(core).not.toHaveBeenCalled()
    click(target)
    expect(childOnce).toHaveBeenCalledTimes(1)
    expect(wrapperOnce).not.toHaveBeenCalled()
    expect(core).toHaveBeenCalledTimes(1)
    expect(errors).not.toHaveBeenCalled()
  })

  it.each(['normal', 'native', 'adapted'] as const)('%s: ordinary stopImmediatePropagation does not consume Once', async (kind) => {
    const order: string[] = []
    let stopped = true
    const once = vi.fn((event: Event) => {
      order.push('once')
      event.preventDefault()
    })
    const core = vi.fn(() => order.push('core'))
    const { host, errors } = fixture((event) => {
      if (!event.defaultPrevented)
        core()
    }, {
      onClick(event: Event) {
        order.push('consumer')
        if (stopped)
          event.stopImmediatePropagation()
      },
      onClickOnce: once,
    }, kind === 'normal' ? undefined : () => childTree(kind, {}))
    await clockBoundary()
    const target = host.querySelector('button')!
    click(target)
    expect(order).toEqual(['consumer'])
    expect(once).not.toHaveBeenCalled()
    stopped = false
    expect(click(target).defaultPrevented).toBe(true)
    expect(order).toEqual(['consumer', 'consumer', 'once'])
    expect(core).not.toHaveBeenCalled()
    expect(click(target).defaultPrevented).toBe(false)
    expect(order).toEqual(['consumer', 'consumer', 'once', 'consumer', 'core'])
    expect(once).toHaveBeenCalledTimes(1)
    expect(core).toHaveBeenCalledTimes(1)
    expect(errors).not.toHaveBeenCalled()
  })

  for (const kind of ['native', 'adapted'] as const) {
    it.each(['sync', 'async'] as const)(`${kind}: child and wrapper Once arrays preserve %s errors and later callbacks`, async (mode) => {
      const order: string[] = []
      const childFailure = new Error('expected child failure')
      const wrapperFailure = new Error('expected wrapper failure')
      function failing(label: string, failure: Error) {
        const fail = () => {
          order.push(label)
          throw failure
        }
        return vi.fn(mode === 'sync' ? fail : async () => fail())
      }
      const childFirst = failing('child-first', childFailure)
      const childLater = vi.fn(() => order.push('child-later'))
      const wrapperFirst = failing('wrapper-first', wrapperFailure)
      const wrapperLater = vi.fn(() => order.push('wrapper-later'))
      const core = vi.fn(() => order.push('core'))
      const { host, errors } = fixture(core, { onClickOnce: [wrapperFirst, wrapperLater] }, () => childTree(kind, {
        onClickOnce: [childFirst, childLater],
      }))
      await clockBoundary()
      const target = host.querySelector('button')!
      click(target)
      await vi.waitFor(() => expect(errors).toHaveBeenCalledTimes(2))
      expect(errors.mock.calls.map(call => call[0])).toEqual([childFailure, wrapperFailure])
      expect(order).toEqual(['child-first', 'child-later', 'wrapper-first', 'wrapper-later', 'core'])
      expect(childFirst).toHaveBeenCalledTimes(1)
      expect(childLater).toHaveBeenCalledTimes(1)
      expect(wrapperFirst).toHaveBeenCalledTimes(1)
      expect(wrapperLater).toHaveBeenCalledTimes(1)
      click(target)
      await nextTick()
      expect(order).toEqual(['child-first', 'child-later', 'wrapper-first', 'wrapper-later', 'core', 'core'])
      expect(errors).toHaveBeenCalledTimes(2)
      expect(core).toHaveBeenCalledTimes(2)
    })

    it(`${kind}: child Once stopImmediatePropagation suppresses later child, wrapper and core callbacks`, async () => {
      const stopped = vi.fn((event: Event) => event.stopImmediatePropagation())
      const later = vi.fn()
      const wrapper = vi.fn()
      const core = vi.fn()
      const { host, errors } = fixture(core, { onClickOnce: [wrapper] }, () => childTree(kind, { onClickOnce: [stopped, later] }))
      await clockBoundary()
      const target = host.querySelector('button')!
      click(target)
      expect(stopped).toHaveBeenCalledTimes(1)
      expect(later).not.toHaveBeenCalled()
      expect(wrapper).not.toHaveBeenCalled()
      expect(core).not.toHaveBeenCalled()
      click(target)
      expect(stopped).toHaveBeenCalledTimes(1)
      expect(later).not.toHaveBeenCalled()
      expect(wrapper).not.toHaveBeenCalled()
      expect(core).toHaveBeenCalledTimes(1)
      expect(errors).not.toHaveBeenCalled()
    })

    it(`${kind}: ignores falsy array entries without changing child/wrapper/core order`, async () => {
      const order: string[] = []
      const falsy = [null, undefined, false, 0, '']
      const { host, errors } = fixture(() => order.push('core'), {
        onClick: [...falsy, () => order.push('wrapper')],
        onClickOnce: [...falsy, () => order.push('wrapper-once')],
      }, () => childTree(kind, {
        onClick: [...falsy, () => order.push('child')],
        onClickOnce: [...falsy, () => order.push('child-once')],
      }))
      await clockBoundary()
      const target = host.querySelector('button')!
      click(target)
      expect(order).toEqual(['child', 'wrapper', 'child-once', 'wrapper-once', 'core'])
      click(target)
      expect(order).toEqual(['child', 'wrapper', 'child-once', 'wrapper-once', 'core', 'child', 'wrapper', 'core'])
      expect(errors).not.toHaveBeenCalled()
    })
  }

  it('uses separate native helpers for two receiving elements', async () => {
    const Child = defineComponent({
      inheritAttrs: false,
      setup(_, { attrs }) {
        const firstProps = useNativeEventProps()
        const secondProps = useNativeEventProps()
        return () => h('div', [h('button', firstProps(attrs), 'First'), h('button', secondProps(attrs), 'Second')])
      },
    })
    const once = vi.fn((event: Event) => event.preventDefault())
    const core = vi.fn()
    const { host, errors } = fixture((event) => {
      if (!event.defaultPrevented)
        core()
    }, { onClickOnce: once }, () => h(Child))
    await clockBoundary()
    const [first, second] = host.querySelectorAll('button')
    expect(click(first).defaultPrevented).toBe(true)
    expect(click(second).defaultPrevented).toBe(true)
    expect(once).toHaveBeenCalledTimes(2)
    expect(core).not.toHaveBeenCalled()
    expect(click(first).defaultPrevented).toBe(false)
    expect(click(second).defaultPrevented).toBe(false)
    expect(once).toHaveBeenCalledTimes(2)
    expect(core).toHaveBeenCalledTimes(2)
    expect(errors).not.toHaveBeenCalled()
  })
})
