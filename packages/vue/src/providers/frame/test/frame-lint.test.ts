import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-vue'
import { defineComponent, h, shallowRef } from 'vue'
import Basic from '../examples/Basic.vue'
import { Frame } from '../index'

describe('frame lint pilot native contracts', () => {
  it('retains the compiled iframe content, lifecycle emits, and public ref', async () => {
    const onMount = vi.fn()
    const onUnmount = vi.fn()
    const frame = shallowRef<InstanceType<typeof Frame> | null>(null)
    const Fixture = defineComponent({
      setup: () => () => h(Frame, { ref: frame, title: 'Lint pilot frame', onMount, onUnmount }, () => h('button', 'Portal content')),
    })
    const screen = render(Fixture)
    try {
      await vi.waitFor(() => {
        const iframe = screen.container.querySelector('iframe')
        expect(iframe).not.toBeNull()
        expect(frame.value?.frameRef).toBe(iframe)
        expect(iframe?.contentDocument?.querySelector('.frame-root button')?.textContent).toBe('Portal content')
        expect(onMount).toHaveBeenCalledTimes(1)
        expect(onUnmount).not.toHaveBeenCalled()
      })
    }
    finally {
      screen.unmount()
    }
    await vi.waitFor(() => expect(onUnmount).toHaveBeenCalledTimes(1))
    expect(onMount).toHaveBeenCalledTimes(1)
    expect(frame.value).toBeNull()
  })

  it('renders the Basic example static style tag into the iframe head', async () => {
    const screen = render(Basic)
    try {
      await vi.waitFor(() => {
        const iframe = screen.container.querySelector('iframe')
        const doc = iframe?.contentDocument
        expect(doc?.head.textContent).toContain('body { background-color: #f0f0f0; }')
        expect(iframe?.contentWindow?.getComputedStyle(doc!.body).backgroundColor).toBe('rgb(240, 240, 240)')
        expect(doc?.querySelector('.frame-root h1')?.textContent).toBe('Hello from inside the frame!')
      })
    }
    finally {
      screen.unmount()
    }
  })
})
