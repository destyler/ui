import type { RefCallback } from 'react'
import { act, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { Presence } from '~/components/presence'
import { ui } from '../index'

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
  const cleanups = vi.fn()
  const ref = vi.fn<RefCallback<HTMLElement>>((node) => {
    if (node === null)
      return
    expect(live.has(node)).toBe(false)
    live.add(node)
    return () => {
      expect(live.delete(node)).toBe(true)
      cleanups(node)
    }
  })
  return { live, ref, cleanups }
}

describe('react callback ref cleanup through wrappers', () => {
  it('cleans parent and asChild refs across replacement and StrictMode unmount', async () => {
    const { root, container } = mount()
    const parent = trackedRef()
    const child = trackedRef()
    const legacy = vi.fn()
    const render = (key: string) => (
      <StrictMode>
        <ui.div asChild ref={parent.ref}>
          <ui.button key={key} asChild ref={legacy}>
            <button ref={child.ref} type="button">Target</button>
          </ui.button>
        </ui.div>
      </StrictMode>
    )
    await act(async () => root.render(render('first')))
    const first = container.querySelector('button')!
    expect(parent.live).toEqual(new Set([first]))
    expect(child.live).toEqual(new Set([first]))
    expect(container.childElementCount).toBe(1)

    await act(async () => root.render(render('second')))
    const second = container.querySelector('button')!
    expect(second).not.toBe(first)
    expect(parent.live).toEqual(new Set([second]))
    expect(child.live).toEqual(new Set([second]))
    expect(parent.cleanups).toHaveBeenCalledWith(first)
    expect(child.cleanups).toHaveBeenCalledWith(first)

    await act(async () => root.render(null))
    expect(parent.live.size).toBe(0)
    expect(child.live.size).toBe(0)
    expect(parent.cleanups).toHaveBeenCalledWith(second)
    expect(child.cleanups).toHaveBeenCalledWith(second)
    expect(parent.ref.mock.calls.every(([node]) => node !== null)).toBe(true)
    expect(child.ref.mock.calls.every(([node]) => node !== null)).toBe(true)
    expect(legacy).toHaveBeenLastCalledWith(null)
  })

  it('preserves cleanup when Presence composes its machine ref with a consumer ref', async () => {
    const { root, container } = mount()
    const consumer = trackedRef()
    await act(async () => root.render(<Presence present ref={consumer.ref}>Content</Presence>))
    const node = container.querySelector('[data-scope="presence"]')!
    expect(consumer.live).toEqual(new Set([node]))
    await act(async () => root.render(null))
    expect(consumer.live.size).toBe(0)
    expect(consumer.cleanups).toHaveBeenCalledTimes(1)
    expect(consumer.ref).toHaveBeenCalledExactlyOnceWith(node)
  })
})
