import { sharedConfig } from 'solid-js'
import { hydrate, render } from 'solid-js/web'
import { describe, expect, it, vi } from 'vitest'
import { FrameFixture } from './fixtures/frame'
import serverHTML from './frame.ssr.html?raw'

function mountFixture(mode: 'render' | 'hydrate') {
  const container = document.createElement('div')
  container.innerHTML = mode === 'hydrate' ? serverHTML : ''
  document.body.append(container)
  const savedConfig = { ...sharedConfig }
  const savedHydration = Reflect.get(globalThis, '_$HY')
  if (mode === 'hydrate') {
    sharedConfig.done = false
    Reflect.set(globalThis, '_$HY', { events: [], completed: new WeakSet(), r: {}, fe() {} })
  }
  const onMount = vi.fn()
  const onUnmount = vi.fn()
  const dispose = (mode === 'hydrate' ? hydrate : render)(
    () => <FrameFixture onMount={onMount} onUnmount={onUnmount} />,
    container,
  )
  let disposed = false
  return {
    container,
    onMount,
    onUnmount,
    dispose() {
      if (disposed)
        return
      disposed = true
      dispose()
      container.remove()
      for (const key of Object.keys(sharedConfig)) {
        if (!(key in savedConfig))
          Reflect.deleteProperty(sharedConfig, key)
      }
      Object.assign(sharedConfig, savedConfig)
      if (savedHydration === undefined)
        Reflect.deleteProperty(globalThis, '_$HY')
      else
        Reflect.set(globalThis, '_$HY', savedHydration)
    },
  }
}

describe.each(['render', 'hydrate'] as const)('frame delegated events after %s', (mode) => {
  it('handles actual iframe clicks before and after srcdoc replacement, then cleans up', async () => {
    const error = vi.spyOn(console, 'error')
    const warn = vi.spyOn(console, 'warn')
    const fixture = mountFixture(mode)
    try {
      const frame = fixture.container.querySelector('iframe')!
      await vi.waitFor(() => expect(frame.contentDocument?.querySelector('button')?.textContent).toBe('Count: 0'))
      expect(frame.childNodes).toHaveLength(0)
      expect(frame.contentDocument?.querySelector('#frame-head')).not.toBeNull()
      const firstDocument = frame.contentDocument!
      const removeEventListener = vi.spyOn(firstDocument, 'removeEventListener')
      const firstButton = firstDocument.querySelector('button')!
      firstButton.click()
      firstButton.click()
      await vi.waitFor(() => expect(firstButton.textContent).toBe('Count: 2'))
      expect(fixture.onMount).toHaveBeenCalledTimes(1)

      fixture.container.querySelector('button')!.click()
      await vi.waitFor(() => {
        expect(frame.contentDocument?.querySelector('main.frame-root button')?.textContent).toBe('Count: 2')
        expect(frame.contentDocument?.querySelector('#frame-head')).not.toBeNull()
      })
      expect(removeEventListener).toHaveBeenCalledWith('click', expect.any(Function))
      expect(fixture.onMount).toHaveBeenCalledTimes(2)
      expect(fixture.onUnmount).toHaveBeenCalledTimes(1)
      const button = frame.contentDocument!.querySelector('button')!
      button.click()
      await vi.waitFor(() => expect(button.textContent).toBe('Count: 3'))
      expect(fixture.container.textContent).toContain('After frame')

      const removeFrameListener = vi.spyOn(frame, 'removeEventListener')
      const removeDocumentListener = vi.spyOn(frame.contentDocument!, 'removeEventListener')
      removeDocumentListener.mockClear()
      fixture.dispose()
      expect(removeFrameListener).toHaveBeenCalledWith('load', expect.any(Function))
      expect(removeDocumentListener).toHaveBeenCalledWith('click', expect.any(Function))
      expect(fixture.onUnmount).toHaveBeenCalledTimes(2)
      expect(error).not.toHaveBeenCalled()
      expect(warn).not.toHaveBeenCalled()
      removeEventListener.mockRestore()
      removeFrameListener.mockRestore()
      removeDocumentListener.mockRestore()
    }
    finally {
      fixture.dispose()
      error.mockRestore()
      warn.mockRestore()
    }
  })

  it('rebinds when a same-origin document finishes loading and ignores duplicate load events', async () => {
    const fixture = mountFixture(mode)
    try {
      const frame = fixture.container.querySelector('iframe')!
      await vi.waitFor(() => expect(frame.contentDocument?.querySelector('button')).toBeTruthy())
      const firstDocument = frame.contentDocument!
      const removeEventListener = vi.spyOn(firstDocument, 'removeEventListener')
      // The native srcdoc property creates a new same-origin Document and emits
      // load, independently of Frame's reactive srcdoc/document.write path.
      frame.srcdoc = '<html><head></head><body><article class="frame-root"></article></body></html>'
      await vi.waitFor(() => expect(frame.contentDocument?.querySelector('article button')).toBeTruthy())
      const doc = frame.contentDocument!
      expect(doc).not.toBe(firstDocument)
      expect(removeEventListener).toHaveBeenCalledWith('click', expect.any(Function))
      removeEventListener.mockRestore()
      doc.querySelector('button')!.click()
      await vi.waitFor(() => expect(doc.querySelector('button')?.textContent).toBe('Count: 1'))
      expect(doc.querySelector('#frame-head')).not.toBeNull()
      expect(fixture.onMount).toHaveBeenCalledTimes(2)
      expect(fixture.onUnmount).toHaveBeenCalledTimes(1)
      frame.dispatchEvent(new Event('load'))
      doc.querySelector('button')!.click()
      await vi.waitFor(() => expect(doc.querySelector('button')?.textContent).toBe('Count: 2'))
      expect(fixture.onMount).toHaveBeenCalledTimes(2)
    }
    finally {
      fixture.dispose()
    }
    expect(fixture.onUnmount).toHaveBeenCalledTimes(2)
  })
})
