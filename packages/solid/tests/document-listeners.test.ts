import { afterEach, expect, it, vi } from 'vitest'
import { trackDocumentListeners } from '../../../utils/test/document-listeners'

const trackers: ReturnType<typeof trackDocumentListeners>[] = []
afterEach(() => {
  for (const tracker of trackers.splice(0))
    tracker.restore()
})

function fixture() {
  const target = document.implementation.createHTMLDocument()
  const listeners = trackDocumentListeners(target, 'keydown')
  trackers.push(listeners)
  return { target, listeners }
}

it('requires an observed registration instead of passing vacuously', () => {
  const { target, listeners } = fixture()
  expect(() => listeners.expectActive()).toThrow()
  target.addEventListener('keydown', () => {})
  listeners.expectActive()
  expect(() => listeners.expectEmpty()).toThrow()
})

it('matches the document, event type and listener identity', () => {
  const { target, listeners } = fixture()
  const listener = () => {}
  target.addEventListener('keydown', listener)
  document.removeEventListener('keydown', listener)
  target.removeEventListener('keyup', listener)
  target.removeEventListener('keydown', () => {})
  expect(() => listeners.expectEmpty()).toThrow()
  target.removeEventListener('keydown', listener)
  listeners.expectEmpty()
})

it('matches normalized capture and ignores irrelevant removal options', () => {
  const { target, listeners } = fixture()
  const listener = { handleEvent() {} }
  target.addEventListener('keydown', listener, { capture: true, passive: true })
  target.removeEventListener('keydown', listener, false)
  expect(() => listeners.expectEmpty()).toThrow()
  target.removeEventListener('keydown', listener, true)
  listeners.expectEmpty()
  target.addEventListener('keydown', listener)
  target.removeEventListener('keydown', listener, { capture: false })
  listeners.expectEmpty()
})

it('deduplicates matching registrations but keeps both capture phases', () => {
  const { target, listeners } = fixture()
  const listener = () => {}
  target.addEventListener('keydown', listener, false)
  target.addEventListener('keydown', listener, { capture: false })
  target.addEventListener('keydown', listener, true)
  target.removeEventListener('keydown', listener)
  expect(() => listeners.expectEmpty()).toThrow()
  target.removeEventListener('keydown', listener, { capture: true })
  listeners.expectEmpty()
})

it('requires a fresh removal after reopening with the same listener', () => {
  const { target, listeners } = fixture()
  const listener = () => {}
  target.addEventListener('keydown', listener)
  target.removeEventListener('keydown', listener)
  listeners.expectEmpty()
  target.addEventListener('keydown', listener)
  listeners.expectActive()
  expect(() => listeners.expectEmpty()).toThrow()
  target.removeEventListener('keydown', listener)
  listeners.expectEmpty()
})

it('restores intercepted methods and retained listeners without removing the baseline', () => {
  const target = document.implementation.createHTMLDocument()
  const baseline = vi.fn()
  const retained = vi.fn()
  const add = target.addEventListener
  const remove = target.removeEventListener
  target.addEventListener('keydown', baseline)
  const listeners = trackDocumentListeners(target, 'keydown')
  target.addEventListener('keydown', retained)
  listeners.restore()
  expect(target.addEventListener).toBe(add)
  expect(target.removeEventListener).toBe(remove)
  target.dispatchEvent(new KeyboardEvent('keydown'))
  expect(baseline).toHaveBeenCalledOnce()
  expect(retained).not.toHaveBeenCalled()
  target.removeEventListener('keydown', baseline)
})
