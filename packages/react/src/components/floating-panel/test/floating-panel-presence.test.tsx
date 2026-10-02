import type { Root } from 'react-dom/client'
import { act, createRef } from 'react'
import { createRoot } from 'react-dom/client'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { FloatingPanel, useFloatingPanel } from '../index'

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true
let root: Root
let host: HTMLDivElement
let api: ReturnType<typeof useFloatingPanel>
function Fixture({ input = {}, cancel = false, contentRef }: any) {
  return (
    <FloatingPanel.Root {...input}>
      <FloatingPanel.Context>{(value) => {
        api = value
        return null
      }}
      </FloatingPanel.Context>
      <FloatingPanel.Trigger onClick={cancel ? e => e.preventDefault() : undefined}>Open</FloatingPanel.Trigger>
      <FloatingPanel.Positioner data-local="yes" style={{ zIndex: 123 }}>
        <FloatingPanel.Content ref={contentRef}><FloatingPanel.Title>Panel</FloatingPanel.Title><FloatingPanel.CloseTrigger>Close</FloatingPanel.CloseTrigger></FloatingPanel.Content>
      </FloatingPanel.Positioner>
    </FloatingPanel.Root>
  )
}
function ProviderFixture({ input = {} }: any) {
  const { lazyMount, unmountOnExit, ...panelProps } = input
  const value = useFloatingPanel(panelProps)
  return (
    <FloatingPanel.RootProvider value={value} lazyMount={lazyMount} unmountOnExit={unmountOnExit}>
      <FloatingPanel.Trigger>Open</FloatingPanel.Trigger>
      <FloatingPanel.Positioner>
        <FloatingPanel.Content>
          <FloatingPanel.Title>Panel</FloatingPanel.Title>
          <FloatingPanel.CloseTrigger>Close</FloatingPanel.CloseTrigger>
        </FloatingPanel.Content>
      </FloatingPanel.Positioner>
    </FloatingPanel.RootProvider>
  )
}
function expectMountedLinkage() {
  const content = host.querySelector<HTMLElement>('[data-part="content"]')!
  const trigger = host.querySelector<HTMLElement>('[data-part="trigger"]')!
  expect(content).not.toBeNull()
  expect(trigger.getAttribute('aria-controls')).toBe(content.id)
  expect(document.getElementById(trigger.getAttribute('aria-controls')!)).toBe(content)
}
function settleFrames() {
  return new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())))
}
async function renderFixture(input: any) {
  await act(async () => {
    root.render(<Fixture input={input} />)
    await settleFrames()
  })
}
async function mount(input = {}, extra = {}, provider = false) {
  host = document.createElement('div')
  document.body.append(host)
  root = createRoot(host)
  await act(async () => {
    root.render(provider ? <ProviderFixture input={input} /> : <Fixture input={input} {...extra} />)
    await settleFrames()
  })
}
async function click(part: string) {
  await act(async () => {
    host.querySelector<HTMLElement>(`[data-part="${part}"]`)!.click()
    await settleFrames()
  })
}
afterEach(async () => {
  if (root)
    await act(async () => root.unmount())
  document.body.replaceChildren()
  vi.restoreAllMocks()
})
describe('react FloatingPanel wrapper contracts', () => {
  it('lazy mounted trigger references only a mounted target', async () => {
    await mount({ lazyMount: true })
    const trigger = host.querySelector('[data-part="trigger"]')!
    expect(host.querySelector('[data-part="content"]')).toBeNull()
    expect(trigger.hasAttribute('aria-controls')).toBe(false)
  })
  it('unmountOnExit clears trigger target and external content ref', async () => {
    const ref = createRef<HTMLDivElement>()
    await mount({ defaultOpen: true, unmountOnExit: true }, { contentRef: ref })
    expect(ref.current?.isConnected).toBe(true)
    await click('close-trigger')
    await vi.waitFor(() => expect(host.querySelector('[data-part="content"]')).toBeNull())
    expect(ref.current).toBeNull()
    expect(host.querySelector('[data-part="trigger"]')!.hasAttribute('aria-controls')).toBe(false)
  })
  it('user preventDefault cancels opening', async () => {
    const onOpenChange = vi.fn()
    await mount({ onOpenChange }, { cancel: true })
    await click('trigger')
    expect(onOpenChange).not.toHaveBeenCalled()
    expect(api.open).toBe(false)
  })
  it('controlled veto then delayed acceptance emits exactly once', async () => {
    const onOpenChange = vi.fn()
    await mount({ open: false, onOpenChange })
    await click('trigger')
    expect(onOpenChange).toHaveBeenCalledExactlyOnceWith({ open: true })
    expect(api.open).toBe(false)
    await renderFixture({ open: true, onOpenChange })
    expect(api.open).toBe(true)
    expect(onOpenChange).toHaveBeenCalledTimes(1)
    await click('close-trigger')
    expect(api.open).toBe(true)
    expect(onOpenChange).toHaveBeenCalledTimes(2)
  })
  it('replaced callbacks are fresh', async () => {
    const first = vi.fn()
    const second = vi.fn()
    await mount({ onOpenChange: first })
    await renderFixture({ onOpenChange: second })
    await click('trigger')
    expect(first).not.toHaveBeenCalled()
    expect(second).toHaveBeenCalledExactlyOnceWith({ open: true })
  })
  it('preserves positioner user style alongside core positioning', async () => {
    await mount()
    const el = host.querySelector<HTMLElement>('[data-part="positioner"]')!
    expect(el.style.position).toBe('absolute')
    expect(el.style.zIndex).toBe('123')
    expect(el.dataset.local).toBe('yes')
  })
  it('links an initially mounted content ID', async () => {
    await mount({ defaultOpen: true })
    expectMountedLinkage()
  })
  it('relinks after controlled acceptance, unmount, and accepted reopening', async () => {
    const onOpenChange = vi.fn()
    const input = { open: false, lazyMount: true, unmountOnExit: true, onOpenChange }
    await mount(input)
    await click('trigger')
    expect(onOpenChange).toHaveBeenLastCalledWith({ open: true })
    await renderFixture({ ...input, open: true })
    expectMountedLinkage()
    await click('close-trigger')
    expect(onOpenChange).toHaveBeenLastCalledWith({ open: false })
    await renderFixture({ ...input, open: false })
    await vi.waitFor(() => expect(host.querySelector('[data-part="content"]')).toBeNull())
    expect(host.querySelector('[data-part="trigger"]')!.hasAttribute('aria-controls')).toBe(false)
    await click('trigger')
    await renderFixture({ ...input, open: true })
    expectMountedLinkage()
  })
  it('rootProvider preserves mounted linkage through close and reopen', async () => {
    await mount({ lazyMount: true, unmountOnExit: true }, {}, true)
    await click('trigger')
    expectMountedLinkage()
    await click('close-trigger')
    await vi.waitFor(() => expect(host.querySelector('[data-part="content"]')).toBeNull())
    expect(host.querySelector('[data-part="trigger"]')!.hasAttribute('aria-controls')).toBe(false)
    await click('trigger')
    expectMountedLinkage()
  })
})
