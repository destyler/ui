import { flushSync, mount, tick, unmount } from 'svelte'
import { afterEach, describe, expect, it, vi } from 'vitest'
import BoundFixture from './open-ownership-bound.fixture.svelte'
import HookFixture from './open-ownership-hook.fixture.svelte'
import Fixture from './open-ownership.fixture.svelte'

let app: ReturnType<typeof Fixture>, host: HTMLDivElement
async function setup(input: any = {}, cancel = false, component: any = Fixture) {
  host = document.createElement('div')
  document.body.append(host)
  app = mount(component, { target: host, props: { input, cancel } })
  flushSync()
  await tick()
}
async function click(part: string) {
  host.querySelector<HTMLElement>(`[data-part="${part}"]`)!.click()
  flushSync()
  await tick()
  await new Promise(r => setTimeout(r, 10))
  flushSync()
  await tick()
}
const state = () => host.querySelector('[data-part="trigger"]')!.getAttribute('data-state')
afterEach(async () => {
  if (app)
    await unmount(app)
  document.body.replaceChildren()
})
describe('svelte FloatingPanel wrapper contracts', () => {
  it('controlled veto has only the requested callback', async () => {
    const cb = vi.fn()
    await setup({ open: true, onOpenChange: cb })
    await click('close-trigger')
    expect(state()).toBe('open')
    expect(cb).toHaveBeenCalledExactlyOnceWith({ open: false })
  })
  it('controlled delayed acceptance does not echo callback', async () => {
    const cb = vi.fn()
    await setup({ open: false, onOpenChange: cb })
    await click('trigger')
    expect(state()).toBe('closed')
    expect(cb).toHaveBeenCalledExactlyOnceWith({ open: true })
    app.updateInput({ open: true, onOpenChange: cb })
    flushSync()
    await tick()
    await vi.waitFor(() => expect(state()).toBe('open'))
    expect(cb).toHaveBeenCalledTimes(1)
  })
  it('callback replacement stays fresh', async () => {
    const first = vi.fn()
    const second = vi.fn()
    await setup({ onOpenChange: first })
    app.updateInput({ onOpenChange: second })
    flushSync()
    await tick()
    await click('trigger')
    expect(first).not.toHaveBeenCalled()
    expect(second).toHaveBeenCalledExactlyOnceWith({ open: true })
  })
  it.each([['Root', Fixture], ['RootProvider', HookFixture]])('%s external controlled toggles never emit request callbacks', async (_, component) => {
    const cb = vi.fn()
    await setup({ open: false, onOpenChange: cb }, false, component)
    for (const open of [true, false, true]) {
      app.updateInput({ open, onOpenChange: cb })
      flushSync()
      await tick()
      await vi.waitFor(() => expect(state()).toBe(open ? 'open' : 'closed'))
    }
    expect(cb).not.toHaveBeenCalled()
  })
  it('bound open acceptance emits once per click', async () => {
    const cb = vi.fn()
    await setup({ onOpenChange: cb }, false, BoundFixture)
    await click('trigger')
    expect(state()).toBe('open')
    expect(cb).toHaveBeenCalledExactlyOnceWith({ open: true })
    await click('close-trigger')
    expect(state()).toBe('closed')
    expect(cb.mock.calls).toEqual([[{ open: true }], [{ open: false }]])
  })
  it('rootProvider delayed acceptance does not echo callback', async () => {
    const cb = vi.fn()
    await setup({ open: false, onOpenChange: cb }, false, HookFixture)
    await click('trigger')
    expect(state()).toBe('closed')
    expect(cb).toHaveBeenCalledExactlyOnceWith({ open: true })
    app.updateInput({ open: true, onOpenChange: cb })
    flushSync()
    await tick()
    await vi.waitFor(() => expect(state()).toBe('open'))
    expect(cb).toHaveBeenCalledTimes(1)
  })
  it('lazy trigger does not reference absent content', async () => {
    await setup({ lazyMount: true })
    expect(host.querySelector('[data-part="content"]')).toBeNull()
    expect(host.querySelector('[data-part="trigger"]')!.hasAttribute('aria-controls')).toBe(false)
  })
  it('preventDefault cancels opening', async () => {
    const cb = vi.fn()
    await setup({ onOpenChange: cb }, true)
    await click('trigger')
    expect(cb).not.toHaveBeenCalled()
    expect(state()).toBe('closed')
  })
})
