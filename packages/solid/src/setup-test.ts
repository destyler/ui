import type { AnatomyInstance } from '@destyler/anatomy'
import ResizeObserver from 'resize-observer-polyfill'
import { vi } from 'vitest'
import '@testing-library/jest-dom/vitest'

export function getParts(anatomy: AnatomyInstance<string>) {
  return Object.values(anatomy.build()).map(
    x => `[data-scope="${x.attrs['data-scope']}"][data-part="${x.attrs['data-part']}"]`,
  )
}

export function getExports<T extends string>(anatomy: AnatomyInstance<T>) {
  return anatomy.keys().map(x => (x.charAt(0).toUpperCase() + x.slice(1)) as Capitalize<T>)
}

globalThis.document.execCommand = () => true
globalThis.ResizeObserver = ResizeObserver
globalThis.URL.createObjectURL = () => 'https://i.pravatar.cc/300'
globalThis.URL.revokeObjectURL = () => {}
globalThis.Element.prototype.scrollIntoView = () => {
  // no-op
}

Object.defineProperty(window, 'navigator', {
  value: {
    clipboard: {
      writeText: vi.fn(),
    },
  },
})

Element.prototype.scrollTo = () => {
  // no-op
}

class IntersectionObserverMock {
  disconnect = vi.fn()
  observe = vi.fn()
  takeRecords = vi.fn(() => [])
  unobserve = vi.fn()
}

vi.stubGlobal('IntersectionObserver', IntersectionObserverMock)
