import { describe, expect, it, vi } from 'vitest'
import { createSSRApp, h, shallowRef } from 'vue'
import { renderToString } from 'vue/server-renderer'
import Content from '../components/Content.vue'
import { Frame } from '../index'

describe('frame lint pilot SSR contracts', () => {
  it('renders the iframe shell without evaluating browser-only portal content', async () => {
    expect(typeof window).toBe('undefined')
    expect(typeof document).toBe('undefined')
    const onMount = vi.fn()
    const onUnmount = vi.fn()
    const frame = shallowRef<InstanceType<typeof Frame> | null>(null)
    const html = await renderToString(createSSRApp({
      render: () => h(Frame, {
        ref: frame,
        title: 'Server frame',
        srcDoc: '<html><body><div class="frame-root"></div></body></html>',
        onMount,
        onUnmount,
      }, {
        default: () => h('button', 'Portal content'),
        head: () => h('style', 'body { color: red; }'),
      }),
    }))
    expect(html).toContain('<iframe title="Server frame">')
    expect(html).not.toContain('Portal content')
    expect(html).not.toContain('body { color: red; }')
    expect(frame.value).toBeNull()
    expect(onMount).not.toHaveBeenCalled()
    expect(onUnmount).not.toHaveBeenCalled()
  })

  it('renders Content slots without firing client lifecycle events on the server', async () => {
    const onMount = vi.fn()
    const onUnmount = vi.fn()
    const html = await renderToString(createSSRApp({
      render: () => h(Content, { onMount, onUnmount }, () => h('span', 'Content slot')),
    }))
    expect(html).toContain('<span>Content slot</span>')
    expect(onMount).not.toHaveBeenCalled()
    expect(onUnmount).not.toHaveBeenCalled()
  })
})
