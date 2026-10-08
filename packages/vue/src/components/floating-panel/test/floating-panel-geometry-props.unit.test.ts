import type { App } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createApp, h, nextTick, reactive } from 'vue'
import { FloatingPanel, useFloatingPanel } from '../index'

let app: App, host: HTMLDivElement, input: Record<string, any>, flags: { cancel: boolean }
function fixture(p: any = {}, cancel = false) {
  return h(FloatingPanel.Root, p, { default: () => [h(FloatingPanel.Trigger, { onClick: cancel ? (e: Event) => e.preventDefault() : undefined }, () => 'Open'), h(FloatingPanel.Positioner, { style: { zIndex: 123 } }, () => h(FloatingPanel.Content, { onKeydown: cancel ? (e: Event) => e.preventDefault() : undefined }, () => [h(FloatingPanel.Title, {}, () => 'Panel'), ...['Close', 'Minimize', 'Maximize', 'Restore'].map(kind => h((FloatingPanel as any)[`${kind}Trigger`], { onClick: cancel ? (e: Event) => e.preventDefault() : undefined }, () => kind))]))] })
}
async function mount(p: any = {}, cancel = false) {
  input = reactive(p)
  flags = reactive({ cancel })
  host = document.createElement('div')
  document.body.append(host)
  app = createApp({ render: () => fixture(input, flags.cancel) })
  app.mount(host)
  await nextTick()
}
async function click(part: string) {
  host.querySelector<HTMLElement>(`[data-part="${part}"]`)!.click()
  await nextTick()
  await new Promise(r => setTimeout(r, 10))
  await nextTick()
}
const state = () => host.querySelector('[data-part="trigger"]')!.getAttribute('data-state')
afterEach(() => {
  app?.unmount()
  document.body.replaceChildren()
  vi.restoreAllMocks()
})
describe('vue FloatingPanel wrapper contracts', () => {
  it('controlled veto and delayed acceptance do not echo callbacks', async () => {
    const cb = vi.fn()
    await mount({ open: false, onOpenChange: cb })
    await click('trigger')
    expect(state()).toBe('closed')
    expect(cb).toHaveBeenCalledExactlyOnceWith({ open: true })
    input.open = true
    await nextTick()
    await vi.waitFor(() => expect(state()).toBe('open'))
    expect(cb).toHaveBeenCalledTimes(1)
    await click('close-trigger')
    expect(state()).toBe('open')
    expect(cb).toHaveBeenCalledTimes(2)
  })
  it('root forwards getAnchorPosition', async () => {
    const cb = vi.fn(() => ({ x: 81, y: 91 }))
    await mount({ getAnchorPosition: cb })
    await click('trigger')
    expect(cb).toHaveBeenCalledOnce()
  })
  it('root forwards getBoundaryEl', async () => {
    const cb = vi.fn(() => document.body)
    await mount({ getBoundaryEl: cb, defaultOpen: true })
    await new Promise(r => setTimeout(r, 40))
    expect(cb).toHaveBeenCalled()
  })
  it('public hook does forward both callbacks', async () => {
    const anchor = vi.fn(() => ({ x: 81, y: 91 }))
    const boundary = vi.fn(() => document.body)
    host = document.createElement('div')
    document.body.append(host)
    app = createApp({ setup() {
      const api = useFloatingPanel({ id: 'hook', getAnchorPosition: anchor, getBoundaryEl: boundary })
      return () => h(FloatingPanel.RootProvider, { value: api.value }, { default: () => [h(FloatingPanel.Trigger, {}, () => 'Open'), h(FloatingPanel.Positioner, {}, () => h(FloatingPanel.Content))] })
    } })
    app.mount(host)
    await click('trigger')
    expect(anchor).toHaveBeenCalledOnce()
    expect(boundary).toHaveBeenCalled()
  })
  it('replaced listeners stay fresh', async () => {
    const first = vi.fn()
    const second = vi.fn()
    await mount({ onOpenChange: first })
    input.onOpenChange = second
    await nextTick()
    await click('trigger')
    expect(first).not.toHaveBeenCalled()
    expect(second).toHaveBeenCalledExactlyOnceWith({ open: true })
  })
  it('preserves user style alongside core positioning', async () => {
    await mount()
    const p = host.querySelector<HTMLElement>('[data-part="positioner"]')!
    expect(p.style.position).toBe('absolute')
    expect(p.style.zIndex).toBe('123')
  })
})
