import { describe, expect, it, vi } from 'vitest'
import { createApp, createSSRApp, h, nextTick, ref } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { Presence } from '../index'

describe.each(['client', 'hydrate'] as const)('presence initial visible lifecycle (%s)', (mode) => {
  it.each([
    { lazyMount: false, unmountOnExit: false },
    { lazyMount: false, unmountOnExit: true },
    { lazyMount: true, unmountOnExit: false },
    { lazyMount: true, unmountOnExit: true },
  ].flatMap(strategy => [true, false].map(initialPresent => ({ ...strategy, initialPresent }))))('tracks present=$initialPresent with lazyMount=$lazyMount and unmountOnExit=$unmountOnExit', async ({ lazyMount, unmountOnExit, initialPresent }) => {
    const container = document.createElement('div')
    document.body.append(container)
    const present = ref(initialPresent)
    const onExitComplete = vi.fn()
    const render = () => h(Presence, {
      present: present.value,
      immediate: true,
      lazyMount,
      unmountOnExit,
      onExitComplete,
    }, () => 'Initially visible')
    let serverNode: Element | null = null
    if (mode === 'hydrate') {
      container.innerHTML = await renderToString(createSSRApp(render))
      serverNode = container.querySelector('[data-scope="presence"]')
      if (initialPresent || !lazyMount)
        expect(serverNode).not.toBeNull()
      else
        expect(serverNode).toBeNull()
    }
    const app = mode === 'hydrate' ? createSSRApp(render) : createApp(render)
    try {
      app.mount(container)
      await nextTick()
      let initial = container.querySelector<HTMLElement>('[data-scope="presence"]')
      if (mode === 'hydrate')
        expect(initial).toBe(serverNode)
      expect(onExitComplete).not.toHaveBeenCalled()
      if (!initialPresent) {
        if (lazyMount)
          expect(initial).toBeNull()
        else
          expect(initial!.hidden).toBe(true)
        present.value = true
        await vi.waitFor(() => expect(container.querySelector<HTMLElement>('[data-scope="presence"]')?.hidden).toBe(false))
        initial = container.querySelector<HTMLElement>('[data-scope="presence"]')
      }
      expect(initial).not.toBeNull()
      expect(initial!.hidden).toBe(false)
      expect(onExitComplete).not.toHaveBeenCalled()

      for (let cycle = 1; cycle <= 2; cycle++) {
        present.value = false
        await nextTick()
        await vi.waitFor(() => expect(onExitComplete).toHaveBeenCalledTimes(cycle))
        await nextTick()
        const closed = container.querySelector<HTMLElement>('[data-scope="presence"]')
        if (unmountOnExit) {
          expect(closed).toBeNull()
        }
        else {
          expect(closed).toBe(initial)
          expect(closed!.hidden).toBe(true)
        }
        present.value = true
        await nextTick()
        await vi.waitFor(() => {
          const reopened = container.querySelector<HTMLElement>('[data-scope="presence"]')
          expect(reopened).not.toBeNull()
          expect(reopened!.hidden).toBe(false)
        })
        expect(onExitComplete).toHaveBeenCalledTimes(cycle)
      }
    }
    finally {
      app.unmount()
      container.remove()
    }
  })
})
