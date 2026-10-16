import type { RefCallback } from 'react'
import { act, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { Presence } from '../index'

beforeAll(() => vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true))
const disposers: (() => void)[] = []
afterEach(async () => {
  await act(async () => disposers.splice(0).forEach(dispose => dispose()))
})
afterAll(() => vi.unstubAllGlobals())

function mount() {
  const container = document.createElement('div')
  document.body.append(container)
  const root = createRoot(container)
  disposers.push(() => {
    root.unmount()
    container.remove()
  })
  return { root, container }
}

function trackedRef() {
  const live = new Set<HTMLElement>()
  const cleanup = vi.fn()
  const ref = vi.fn<RefCallback<HTMLElement>>((node) => {
    if (node === null)
      return
    expect(live.has(node)).toBe(false)
    live.add(node)
    return () => {
      expect(live.delete(node)).toBe(true)
      cleanup(node)
    }
  })
  return { ref, live, cleanup }
}

describe('presence callback-ref stability with the real core adapter', () => {
  it.each([false, true])('does not reattach unchanged refs on prop or presence updates (asChild=%s)', async (asChild) => {
    const { root, container } = mount()
    const owner = trackedRef()
    const childRef = vi.fn()
    const render = async (present: boolean, revision: number) => {
      await act(async () => root.render(
        <StrictMode>
          <Presence present={present} immediate asChild={asChild} ref={owner.ref} data-revision={revision}>
            <span ref={childRef}>Content {revision}</span>
          </Presence>
        </StrictMode>,
      ))
    }
    await render(false, 0)
    const target = container.querySelector<HTMLElement>('[data-scope="presence"]')!
    expect(owner.live).toEqual(new Set([target]))
    const attachmentCount = owner.ref.mock.calls.length
    const cleanupCount = owner.cleanup.mock.calls.length
    const childCallCount = childRef.mock.calls.length

    for (const [revision, present] of [false, true, false, true].entries()) {
      await render(present, revision + 1)
      expect(container.querySelector('[data-scope="presence"]')).toBe(target)
      expect(target.hidden).toBe(!present)
      expect(target.dataset.revision).toBe(String(revision + 1))
      expect(target.textContent).toBe(`Content ${revision + 1}`)
      expect(owner.ref).toHaveBeenCalledTimes(attachmentCount)
      expect(owner.cleanup).toHaveBeenCalledTimes(cleanupCount)
      expect(childRef).toHaveBeenCalledTimes(childCallCount)
    }

    await act(async () => root.render(null))
    expect(owner.live.size).toBe(0)
    expect(owner.cleanup).toHaveBeenCalledTimes(cleanupCount + 1)
    expect(owner.ref.mock.calls.every(([node]) => node !== null)).toBe(true)
    expect(childRef.mock.calls.at(-1)?.[0]).toBeNull()
  })

  it.each([false, true])('transfers changed consumer refs without replacing the DOM node (asChild=%s)', async (asChild) => {
    const { root, container } = mount()
    const first = trackedRef()
    const second = trackedRef()
    const render = async (ref: RefCallback<HTMLElement>) => {
      await act(async () => root.render(
        <Presence present immediate asChild={asChild} ref={ref}>
          <span>Content</span>
        </Presence>,
      ))
    }
    await render(first.ref)
    const target = container.querySelector<HTMLElement>('[data-scope="presence"]')!
    await render(second.ref)
    expect(container.querySelector('[data-scope="presence"]')).toBe(target)
    expect(first.live.size).toBe(0)
    expect(first.cleanup).toHaveBeenCalledExactlyOnceWith(target)
    expect(second.live).toEqual(new Set([target]))
    expect(second.ref).toHaveBeenCalledExactlyOnceWith(target)
    await render(second.ref)
    expect(second.ref).toHaveBeenCalledTimes(1)
    expect(second.cleanup).not.toHaveBeenCalled()
    await act(async () => root.render(null))
    expect(second.live.size).toBe(0)
    expect(second.cleanup).toHaveBeenCalledExactlyOnceWith(target)
  })

  it('registers real replacement nodes after lazy mounting, exit and reopening', async () => {
    const { root, container } = mount()
    const owner = trackedRef()
    const render = async (present: boolean, key: string) => {
      await act(async () => root.render(
        <StrictMode>
          <Presence present={present} immediate lazyMount unmountOnExit asChild ref={owner.ref}>
            <div key={key}>Content</div>
          </Presence>
        </StrictMode>,
      ))
    }
    await render(false, 'first')
    expect(container.childElementCount).toBe(0)
    expect(owner.ref).not.toHaveBeenCalled()
    await render(true, 'first')
    const first = container.firstElementChild as HTMLElement
    expect(owner.live).toEqual(new Set([first]))
    await render(true, 'second')
    const second = container.firstElementChild as HTMLElement
    expect(second).not.toBe(first)
    expect(owner.live).toEqual(new Set([second]))
    expect(owner.cleanup).toHaveBeenCalledWith(first)
    await render(false, 'second')
    expect(container.childElementCount).toBe(0)
    expect(owner.live.size).toBe(0)
    await render(true, 'second')
    const reopened = container.firstElementChild as HTMLElement
    expect(reopened).not.toBe(second)
    expect(owner.live).toEqual(new Set([reopened]))
    expect(reopened.hidden).toBe(false)
  })

  it('restores animation ownership after StrictMode effect replay and a real remount', async () => {
    const { root, container } = mount()
    const style = document.createElement('style')
    style.textContent = '@keyframes stable-ref-enter { from { opacity: .9 } to { opacity: 1 } } @keyframes stable-ref-exit { from { opacity: 1 } to { opacity: .9 } }'
    document.head.append(style)
    disposers.push(() => style.remove())
    const exited = vi.fn()
    const render = async (present: boolean) => {
      await act(async () => root.render(
        <StrictMode>
          <Presence present={present} immediate unmountOnExit onExitComplete={exited} style={{ animationName: present ? 'stable-ref-enter' : 'stable-ref-exit', animationDuration: '60s' }}>
            <span>Animated content</span>
          </Presence>
        </StrictMode>,
      ))
    }
    for (let cycle = 0; cycle < 2; cycle++) {
      await render(true)
      const target = container.querySelector<HTMLElement>('[data-scope="presence"]')!
      await render(false)
      // Without node registration after StrictMode replay, styles stay null and
      // the real presence machine incorrectly treats this as an unanimated exit.
      expect(container.querySelector('[data-scope="presence"]')).toBe(target)
      expect(target.hidden).toBe(false)
      expect(exited).toHaveBeenCalledTimes(cycle)
      await act(async () => target.querySelector('span')!.dispatchEvent(new Event('animationend', { bubbles: true })))
      expect(container.querySelector('[data-scope="presence"]')).toBe(target)
      await act(async () => target.dispatchEvent(new Event('animationend', { bubbles: true })))
      expect(container.childElementCount).toBe(0)
      expect(exited).toHaveBeenCalledTimes(cycle + 1)
    }
  })
})
