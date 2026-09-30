import type { App, ComponentPublicInstance } from 'vue'
import { afterEach, describe, expect, it } from 'vitest'
import { createApp, defineComponent, Fragment, h, nextTick, ref, watchEffect } from 'vue'
import { useForwardExpose } from '../use-forward-expose'

const mounts: { app: App, container: HTMLElement }[] = []

afterEach(() => {
  mounts.splice(0).forEach(({ app, container }) => {
    app.unmount()
    container.remove()
  })
})

describe('useForwardExpose native refs', () => {
  it('exposes the forwarded native element rather than its wrapping root and handles null on unmount', async () => {
    let api: ReturnType<typeof useForwardExpose> | undefined
    const exposed = ref<ComponentPublicInstance | null>(null)
    const Child = defineComponent({
      setup() {
        api = useForwardExpose()
        const { forwardRef } = api
        return () => h('div', [h('button', { ref: forwardRef }, 'Target')])
      },
    })
    const container = document.createElement('div')
    document.body.append(container)
    const app = createApp(() => h(Child, { ref: exposed }))
    app.mount(container)
    mounts.push({ app, container })
    await nextTick()

    const target = container.querySelector('button')
    expect(target).not.toBeNull()
    expect(api?.currentElement.value).toBe(target)
    expect(exposed.value?.$el).toBe(target)

    expect(() => app.unmount()).not.toThrow()
    mounts.pop()
    container.remove()
    expect(api?.currentRef.value).toBeNull()
    expect(api?.currentElement.value).toBeUndefined()
  })

  it.each([false, true])('tracks root replacements inside a stable forwarded component chain (fragment=%s)', async (fragment) => {
    let api: ReturnType<typeof useForwardExpose> | undefined
    const generation = ref(0)
    const componentGeneration = ref(0)
    const label = ref('initial')
    const exposed = ref<ComponentPublicInstance | null>(null)
    const inner = ref<ComponentPublicInstance | null>(null)
    const elements: (Element | undefined)[] = []
    const Inner = defineComponent(() => () => h('textarea', { 'key': generation.value, 'aria-label': label.value }))
    const Middle = defineComponent(() => () => {
      const child = h(Inner, { ref: inner, key: componentGeneration.value })
      return fragment ? h(Fragment, [child, h('span', 'Sibling')]) : child
    })
    const Forwarder = defineComponent({
      setup() {
        api = useForwardExpose()
        watchEffect(() => elements.push(api?.currentElement.value), { flush: 'post' })
        return () => h(Middle, { ref: api?.forwardRef })
      },
    })
    const container = document.createElement('div')
    document.body.append(container)
    const app = createApp(() => h(Forwarder, { ref: exposed }))
    app.mount(container)
    mounts.push({ app, container })
    await nextTick()

    const forwarded = api?.currentRef.value
    const child = inner.value
    const first = container.querySelector('textarea')
    expect(api?.currentElement.value).toBe(first)
    expect(exposed.value?.$el).toBe(first)

    label.value = 'updated'
    await nextTick()
    expect(elements).toEqual([first])

    generation.value++
    await nextTick()
    const second = container.querySelector('textarea')
    expect(second).not.toBe(first)
    expect(inner.value).toBe(child)
    expect(api?.currentRef.value).toBe(forwarded)
    expect(api?.currentElement.value).toBe(second)
    expect(exposed.value?.$el).toBe(second)
    expect(elements).toEqual([first, second])

    componentGeneration.value++
    await nextTick()
    const third = container.querySelector('textarea')
    expect(inner.value === child).toBe(false)
    expect(third).not.toBe(second)
    expect(api?.currentRef.value).toBe(forwarded)
    expect(exposed.value?.$el).toBe(third)

    generation.value++
    await nextTick()
    const fourth = container.querySelector('textarea')
    expect(fourth).not.toBe(third)
    expect(api?.currentElement.value).toBe(fourth)
    expect(exposed.value?.$el).toBe(fourth)
    expect(elements).toEqual([first, second, third, fourth])

    app.unmount()
    mounts.pop()
    container.remove()
    expect(api?.currentRef.value).toBeNull()
    expect(api?.currentElement.value).toBeUndefined()
  })

  it('preserves an explicitly exposed nested element', async () => {
    const generation = ref(0)
    const exposed = ref<ComponentPublicInstance | null>(null)
    const Child = defineComponent({
      setup(_, { expose }) {
        const target = ref<HTMLButtonElement | null>(null)
        expose({
          get $el() {
            return target.value
          },
        })
        return () => h('div', [h('button', { ref: target, key: generation.value }, 'Target')])
      },
    })
    const Forwarder = defineComponent({
      setup() {
        const { forwardRef } = useForwardExpose()
        return () => h(Child, { ref: forwardRef })
      },
    })
    const container = document.createElement('div')
    document.body.append(container)
    const app = createApp(() => h(Forwarder, { ref: exposed }))
    app.mount(container)
    mounts.push({ app, container })
    await nextTick()
    const first = container.querySelector('button')
    expect(exposed.value?.$el).toBe(first)

    generation.value++
    await nextTick()
    const second = container.querySelector('button')
    expect(second).not.toBe(first)
    expect(exposed.value?.$el).toBe(second)
  })
})
