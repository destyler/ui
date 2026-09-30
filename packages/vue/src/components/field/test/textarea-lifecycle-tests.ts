import type { App, ComponentPublicInstance } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createApp, defineComponent, getCurrentInstance, h, nextTick, ref, Suspense } from 'vue'
import { Field } from '../index'

const { autoresizeTextarea, cleanup } = vi.hoisted(() => {
  const cleanup = vi.fn()
  return { autoresizeTextarea: vi.fn(() => cleanup), cleanup }
})

vi.mock('@destyler/auto-resize', () => ({ autoresizeTextarea }))

const mounts: { app: App, container: HTMLElement }[] = []

afterEach(() => {
  mounts.splice(0).forEach(({ app, container }) => {
    app.unmount()
    container.remove()
  })
  vi.clearAllMocks()
  autoresizeTextarea.mockReset().mockImplementation(() => cleanup)
})

function mountTextarea(asChild = false) {
  const autoresize = ref(true)
  const unrelated = ref('initial')
  const exposed = ref<ComponentPublicInstance | null>(null)
  const generation = ref(0)
  const childInstances: ComponentPublicInstance[] = []
  const TextareaChild = defineComponent({
    setup() {
      childInstances.push(getCurrentInstance()!.proxy!)
      return () => h('textarea', { key: generation.value })
    },
  })
  const container = document.createElement('div')
  document.body.append(container)
  const app = createApp({
    setup: () => () => h(Field.Root, {}, {
      default: () => h(Field.Textarea, { 'ref': exposed, 'autoresize': autoresize.value, asChild, 'data-label': unrelated.value }, {
        default: asChild ? () => h(TextareaChild) : undefined,
      }),
    }),
  })
  app.mount(container)
  mounts.push({ app, container })
  return { app, container, autoresize, unrelated, exposed, generation, childInstances }
}

function mountSuspenseTextarea() {
  let resolve!: () => void
  const ready = new Promise<void>((done) => {
    resolve = done
  })
  const generation = ref(0)
  const exposed = ref<ComponentPublicInstance | null>(null)
  const childInstances: ComponentPublicInstance[] = []
  const AsyncTextarea = defineComponent({
    async setup() {
      await ready
      return () => h('textarea', { 'key': generation.value, 'data-kind': 'resolved' })
    },
  })
  const TextareaChild = defineComponent({
    inheritAttrs: false,
    setup(_, { attrs }) {
      childInstances.push(getCurrentInstance()!.proxy!)
      return () => h(Suspense, null, {
        default: () => h(AsyncTextarea, attrs),
        fallback: () => h('textarea', { ...attrs, 'data-kind': 'fallback' }),
      })
    },
  })
  const container = document.createElement('div')
  document.body.append(container)
  const app = createApp(() => h(Field.Root, {}, {
    default: () => h(Field.Textarea, { ref: exposed, asChild: true, autoresize: true }, {
      default: () => h(TextareaChild),
    }),
  }))
  app.mount(container)
  mounts.push({ app, container })
  return { app, container, resolve, ready, generation, exposed, childInstances }
}

describe('field.Textarea autoresize', () => {
  it.each([false, true])('resolves the textarea behind the polymorphic component (asChild=%s)', async (asChild) => {
    const { container, unrelated, exposed } = mountTextarea(asChild)
    await nextTick()
    const textarea = container.querySelector('textarea')
    expect(textarea).not.toBeNull()
    expect(container.querySelectorAll('textarea')).toHaveLength(1)
    expect(exposed.value?.$el).toBe(textarea)
    expect(autoresizeTextarea).toHaveBeenCalledExactlyOnceWith(textarea)

    unrelated.value = 'updated'
    await nextTick()
    expect(autoresizeTextarea).toHaveBeenCalledTimes(1)
    expect(cleanup).not.toHaveBeenCalled()
  })

  it('cleans up when disabled and on unmount after re-enabling', async () => {
    const { app, container, autoresize } = mountTextarea()
    await nextTick()
    autoresize.value = false
    await nextTick()
    expect(cleanup).toHaveBeenCalledTimes(1)
    expect(autoresizeTextarea).toHaveBeenCalledTimes(1)

    autoresize.value = true
    await nextTick()
    expect(autoresizeTextarea).toHaveBeenCalledTimes(2)
    app.unmount()
    mounts.splice(mounts.findIndex(mount => mount.container === container), 1)
    container.remove()
    expect(cleanup).toHaveBeenCalledTimes(2)
  })

  it('rebinds once per replacement root while the asChild component stays mounted', async () => {
    const cleanups = [vi.fn(), vi.fn(), vi.fn()]
    cleanups.forEach(dispose => autoresizeTextarea.mockReturnValueOnce(dispose))
    const { app, container, unrelated, exposed, generation, childInstances } = mountTextarea(true)
    await nextTick()
    const first = container.querySelector('textarea')!
    const forwarded = exposed.value
    const child = childInstances[0]
    expect(exposed.value?.$el).toBe(first)
    expect(autoresizeTextarea).toHaveBeenCalledExactlyOnceWith(first)

    generation.value++
    await nextTick()
    const second = container.querySelector('textarea')!
    expect(second).not.toBe(first)
    expect(first.isConnected).toBe(false)
    expect(second.isConnected).toBe(true)
    expect(childInstances).toEqual([child])
    expect(exposed.value).toBe(forwarded)
    expect(exposed.value?.$el).toBe(second)
    expect(autoresizeTextarea).toHaveBeenCalledTimes(2)
    expect(autoresizeTextarea).toHaveBeenNthCalledWith(2, second)
    expect(cleanups[0]).toHaveBeenCalledTimes(1)
    expect(cleanups[1]).not.toHaveBeenCalled()
    expect(cleanups[0].mock.invocationCallOrder[0]).toBeLessThan(autoresizeTextarea.mock.invocationCallOrder[1])

    unrelated.value = 'updated'
    await nextTick()
    expect(container.querySelector('textarea')).toBe(second)
    expect(autoresizeTextarea).toHaveBeenCalledTimes(2)
    expect(cleanups[0]).toHaveBeenCalledTimes(1)
    expect(cleanups[1]).not.toHaveBeenCalled()

    generation.value++
    await nextTick()
    const third = container.querySelector('textarea')!
    expect(third).not.toBe(second)
    expect(second.isConnected).toBe(false)
    expect(childInstances).toEqual([child])
    expect(exposed.value?.$el).toBe(third)
    expect(autoresizeTextarea).toHaveBeenCalledTimes(3)
    expect(autoresizeTextarea).toHaveBeenNthCalledWith(3, third)
    expect(cleanups[0]).toHaveBeenCalledTimes(1)
    expect(cleanups[1]).toHaveBeenCalledTimes(1)
    expect(cleanups[2]).not.toHaveBeenCalled()
    expect(cleanups[1].mock.invocationCallOrder[0]).toBeLessThan(autoresizeTextarea.mock.invocationCallOrder[2])

    app.unmount()
    mounts.splice(mounts.findIndex(mount => mount.container === container), 1)
    container.remove()
    cleanups.forEach(dispose => expect(dispose).toHaveBeenCalledTimes(1))
  })

  it('registers the latest asChild root when autoresize is re-enabled', async () => {
    const { app, container, autoresize, exposed, generation } = mountTextarea(true)
    await nextTick()
    const first = container.querySelector('textarea')
    autoresize.value = false
    await nextTick()
    expect(cleanup).toHaveBeenCalledTimes(1)

    generation.value++
    await nextTick()
    const second = container.querySelector('textarea')
    expect(second).not.toBe(first)
    expect(exposed.value?.$el).toBe(second)
    expect(autoresizeTextarea).toHaveBeenCalledTimes(1)
    expect(cleanup).toHaveBeenCalledTimes(1)

    autoresize.value = true
    await nextTick()
    expect(autoresizeTextarea).toHaveBeenCalledTimes(2)
    expect(autoresizeTextarea).toHaveBeenNthCalledWith(2, second)
    app.unmount()
    mounts.splice(mounts.findIndex(mount => mount.container === container), 1)
    container.remove()
    expect(cleanup).toHaveBeenCalledTimes(2)
  })

  it('rebinds from a Suspense fallback to its resolved textarea and tracks later root replacements', async () => {
    const cleanups = [vi.fn(), vi.fn(), vi.fn()]
    cleanups.forEach(dispose => autoresizeTextarea.mockReturnValueOnce(dispose))
    const { app, container, resolve, generation, exposed, childInstances } = mountSuspenseTextarea()
    await nextTick()

    const fallback = container.querySelector('textarea')!
    const forwarded = exposed.value
    const child = childInstances[0]
    expect(fallback.dataset.kind).toBe('fallback')
    expect(exposed.value?.$el).toBe(fallback)
    expect(autoresizeTextarea).toHaveBeenCalledExactlyOnceWith(fallback)

    resolve()
    await vi.waitFor(() => expect(container.querySelector('textarea')?.dataset.kind).toBe('resolved'))
    await nextTick()
    const resolved = container.querySelector('textarea')!
    expect(resolved).not.toBe(fallback)
    expect(fallback.isConnected).toBe(false)
    expect(childInstances).toEqual([child])
    expect(exposed.value).toBe(forwarded)
    expect(exposed.value?.$el).toBe(resolved)
    expect(autoresizeTextarea).toHaveBeenCalledTimes(2)
    expect(autoresizeTextarea).toHaveBeenNthCalledWith(2, resolved)
    expect(cleanups[0]).toHaveBeenCalledTimes(1)
    expect(cleanups[1]).not.toHaveBeenCalled()
    expect(cleanups[0].mock.invocationCallOrder[0]).toBeLessThan(autoresizeTextarea.mock.invocationCallOrder[1])

    generation.value++
    await nextTick()
    const replacement = container.querySelector('textarea')!
    expect(replacement).not.toBe(resolved)
    expect(resolved.isConnected).toBe(false)
    expect(exposed.value?.$el).toBe(replacement)
    expect(autoresizeTextarea).toHaveBeenCalledTimes(3)
    expect(autoresizeTextarea).toHaveBeenNthCalledWith(3, replacement)
    expect(cleanups[0]).toHaveBeenCalledTimes(1)
    expect(cleanups[1]).toHaveBeenCalledTimes(1)
    expect(cleanups[2]).not.toHaveBeenCalled()

    app.unmount()
    mounts.splice(mounts.findIndex(mount => mount.container === container), 1)
    container.remove()
    cleanups.forEach(dispose => expect(dispose).toHaveBeenCalledTimes(1))
  })

  it('cleans up a Suspense fallback once when unmounted before resolution', async () => {
    const { app, container, resolve, ready, exposed } = mountSuspenseTextarea()
    await nextTick()
    const fallback = container.querySelector('textarea')!
    expect(fallback.dataset.kind).toBe('fallback')
    expect(exposed.value?.$el).toBe(fallback)
    expect(autoresizeTextarea).toHaveBeenCalledExactlyOnceWith(fallback)

    app.unmount()
    mounts.splice(mounts.findIndex(mount => mount.container === container), 1)
    container.remove()
    expect(cleanup).toHaveBeenCalledTimes(1)

    resolve()
    await ready
    await nextTick()
    await nextTick()
    expect(exposed.value).toBeNull()
    expect(autoresizeTextarea).toHaveBeenCalledTimes(1)
    expect(cleanup).toHaveBeenCalledTimes(1)
  })
})
