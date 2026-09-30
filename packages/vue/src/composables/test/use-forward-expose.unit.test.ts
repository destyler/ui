import type { App, ComponentPublicInstance } from 'vue'
import { afterEach, describe, expect, it } from 'vitest'
import { createApp, defineComponent, h, nextTick, ref } from 'vue'
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
})
