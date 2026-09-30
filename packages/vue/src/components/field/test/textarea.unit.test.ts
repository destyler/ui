import type { App, ComponentPublicInstance } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createApp, defineComponent, h, nextTick, ref } from 'vue'
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
})

function mountTextarea(asChild = false) {
  const autoresize = ref(true)
  const unrelated = ref('initial')
  const exposed = ref<ComponentPublicInstance | null>(null)
  const TextareaChild = defineComponent(() => () => h('textarea'))
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
  return { app, container, autoresize, unrelated, exposed }
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
})
