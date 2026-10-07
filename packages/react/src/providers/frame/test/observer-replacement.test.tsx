import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { expect, it, vi } from 'vitest'
import { Frame } from '../components/Frame'

it('moves its resize observation from the discarded srcDoc root to the new root', async () => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  const container = document.createElement('div')
  document.body.append(container)
  const root = createRoot(container)
  let frame: HTMLIFrameElement | null = null
  let observe: ReturnType<typeof vi.spyOn> | undefined
  let disconnect: ReturnType<typeof vi.spyOn> | undefined
  const ref = (node: HTMLIFrameElement | null) => {
    frame = node
    if (node && !observe) {
      const prototype = (node.contentWindow as Window & typeof globalThis).ResizeObserver.prototype
      observe = vi.spyOn(prototype, 'observe')
      disconnect = vi.spyOn(prototype, 'disconnect')
    }
  }
  const html = (id: string) => `<html><head></head><body><div class="frame-root" id="${id}"></div></body></html>`
  try {
    await act(async () => root.render(<Frame ref={ref} srcDoc={html('first')}>Content</Frame>))
    const first = (frame as HTMLIFrameElement | null)!.contentDocument!.querySelector('#first')!
    expect(first.textContent).toBe('Content')
    expect(observe).toHaveBeenLastCalledWith(first)
    let previous = first
    for (const id of ['second', 'third']) {
      const oldDisconnects = disconnect!.mock.calls.length
      const oldObserver = observe!.mock.contexts.at(-1)
      await act(async () => root.render(<Frame ref={ref} srcDoc={html(id)}>Content</Frame>))
      const current = (frame as HTMLIFrameElement | null)!.contentDocument!.querySelector(`#${id}`)!
      expect(current.textContent).toBe('Content')
      expect(current).not.toBe(previous)
      expect(observe).toHaveBeenLastCalledWith(current)
      expect(disconnect!.mock.calls.length).toBe(oldDisconnects + 1)
      expect(disconnect!.mock.contexts.at(-1)).toBe(oldObserver)
      expect(observe!.mock.contexts.at(-1)).not.toBe(oldObserver)
      previous = current
    }
    const observations = observe!.mock.calls.length
    const disconnects = disconnect!.mock.calls.length
    await act(async () => root.render(<Frame ref={ref} srcDoc={html('third')}>Updated content</Frame>))
    expect(previous.textContent).toBe('Updated content')
    expect(observe!.mock.calls.length).toBe(observations)
    expect(disconnect!.mock.calls.length).toBe(disconnects)
    await act(async () => root.render(null))
    expect(disconnect!.mock.calls.length).toBe(disconnects + 1)
    expect(disconnect!.mock.contexts.at(-1)).toBe(observe!.mock.contexts.at(-1))
  }
  finally {
    await act(async () => root.unmount())
    observe?.mockRestore()
    disconnect?.mockRestore()
    container.remove()
    vi.unstubAllGlobals()
  }
})
