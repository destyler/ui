import { hydrate, mount, tick, unmount } from 'svelte'
import { expect, it, vi } from 'vitest'
import childHtml from './calendar-content-ref.child.ssr.html?raw'
import Fixture from './calendar-content-ref.fixture.svelte'
import nativeHtml from './calendar-content-ref.native.ssr.html?raw'

function target(html = '') {
  const element = document.createElement('div')
  element.innerHTML = html
  document.body.append(element)
  return element
}

for (const undefinedRef of [false, true]) {
  it(`renders an unbound optional ref without a fallback error, undefined=${undefinedRef}`, async () => {
    const container = target()
    const root = mount(Fixture, { target: container, props: { bound: false, undefinedRef } })
    try {
      await tick()
      expect(container.querySelector('[data-testid=content]')).not.toBeNull()
      expect(root.currentRef()).toBe(undefinedRef ? undefined : null)
    }
    finally {
      await unmount(root)
      container.remove()
    }
  })
}

for (const child of [false, true]) {
  for (const undefinedRef of [false, true]) {
    it(`owns the bound node through updates, removal and recreation, child=${child}, undefined=${undefinedRef}`, async () => {
      const container = target()
      const onContentClick = vi.fn()
      const root = mount(Fixture, { target: container, props: { child, undefinedRef, onContentClick } })
      let disposed = false
      try {
        await tick()
        let content = container.querySelector<HTMLElement>('[data-testid=content]')!
        expect(content).not.toBeNull()
        expect(root.currentRef()).toBe(content)
        expect(content.tagName).toBe('DIV')
        expect(content.getAttribute('data-child')).toBe(child ? 'first' : null)
        root.rename()
        await tick()
        expect(root.currentRef()).toBe(content)
        expect(content.title).toBe('updated')
        content.click()
        expect(onContentClick).toHaveBeenCalledTimes(1)
        if (child) {
          root.replace()
          await tick()
          const replacement = container.querySelector<HTMLElement>('[data-child=replacement][data-testid=content]')!
          expect(replacement).not.toBeNull()
          expect(replacement).not.toBe(content)
          expect(root.currentRef()).toBe(replacement)
          expect(content.isConnected).toBe(false)
          content = replacement
        }
        root.setVisible(false)
        await tick()
        expect(content.isConnected).toBe(false)
        expect(root.currentRef()).toBeNull()
        root.setVisible(true)
        await tick()
        expect(root.currentRef()).toBe(container.querySelector('[data-testid=content]'))
        expect(root.currentRef()).not.toBe(content)
        await unmount(root)
        disposed = true
        expect(root.currentRef()).toBeNull()
      }
      finally {
        if (!disposed)
          await unmount(root)
        container.remove()
      }
    })
  }

  it(`clears and reattaches through real presence exit and reopen, child=${child}`, async () => {
    const container = target()
    const root = mount(Fixture, { target: container, props: { child } })
    try {
      await tick()
      const content = root.currentRef()
      expect(content).not.toBeNull()
      root.setOpen(false)
      await vi.waitFor(() => expect(container.querySelector('[data-testid=content]')).toBeNull())
      expect(root.currentRef()).toBeNull()
      root.setOpen(true)
      await vi.waitFor(() => expect(container.querySelector('[data-testid=content]')).not.toBeNull())
      expect(root.currentRef()).toBe(container.querySelector('[data-testid=content]'))
      expect(root.currentRef()).not.toBe(content)
    }
    finally {
      await unmount(root)
      expect(root.currentRef()).toBeNull()
      container.remove()
    }
  })

  for (const undefinedRef of [false, true]) {
    it(`hydrates the server node and keeps its ref ownership, child=${child}, undefined=${undefinedRef}`, async () => {
      const container = target(child ? childHtml : nativeHtml)
      const serverNode = container.querySelector('[data-testid=content]')
      const serverInput = container.querySelector('input')
      const warnings = vi.spyOn(console, 'warn')
      const errors = vi.spyOn(console, 'error')
      const onContentClick = vi.fn()
      let cleanup: () => void | Promise<void> = () => {}
      try {
        const root = hydrate(Fixture, { target: container, props: { child, undefinedRef, onContentClick }, recover: false })
        cleanup = async () => {
          await unmount(root)
          expect(root.currentRef()).toBeNull()
        }
        await tick()
        expect(serverNode).not.toBeNull()
        expect(root.currentRef()).toBe(serverNode)
        expect(container.querySelector('[data-testid=content]')).toBe(serverNode)
        expect(container.querySelector('input')).toBe(serverInput)
        ;(serverNode as HTMLElement).click()
        expect(onContentClick).toHaveBeenCalledTimes(1)
        root.rename()
        await tick()
        expect(root.currentRef()).toBe(serverNode)
        expect(serverNode?.getAttribute('title')).toBe('updated')
        expect(warnings).not.toHaveBeenCalled()
        expect(errors).not.toHaveBeenCalled()
      }
      finally {
        try {
          await cleanup()
        }
        finally {
          container.remove()
          warnings.mockRestore()
          errors.mockRestore()
        }
      }
    })
  }
}
