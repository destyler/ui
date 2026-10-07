import type { HTMLElement } from 'happy-dom'
import { Window } from 'happy-dom'
import { expect } from 'vitest'

// Parsing SSR output checks emitted contracts, not hydration or native layout.
export function assertStructuralMarkup(html: string, ratio: number, vertical: boolean) {
  const window = new Window()
  const host = window.document.createElement('main')
  host.innerHTML = html
  const part = (scope: string, name: string) => {
    const element = host.querySelector(`[data-scope="${scope}"][data-part="${name}"]`) as HTMLElement | null
    expect(element).not.toBeNull()
    return element!
  }
  const frame = part('aspect-ratio', 'root')
  expect(frame.tagName).toBe('DIV')
  expect(frame.id).toBe('aspect-ratio:frame')
  expect(frame.style.position).toBe('relative')
  expect(frame.style.width).toBe('100%')
  expect(frame.style.paddingBottom).toBe(`${100 / ratio}%`)
  const content = part('aspect-ratio', 'content')
  expect(content.id).toBe('caller-content')
  expect(content.style.position).toBe('absolute')
  expect(content.parentElement).toBe(frame)
  expect(part('breadcrumbs', 'root').tagName).toBe('NAV')
  expect(part('breadcrumbs', 'root').getAttribute('aria-label')).toBe('Trail')
  expect(part('breadcrumbs', 'list').tagName).toBe('OL')
  const items = host.querySelectorAll('[data-scope="breadcrumbs"][data-part="item"]')
  expect([...items].map(node => node.tagName)).toEqual(['LI', 'LI'])
  const links = host.querySelectorAll('[data-scope="breadcrumbs"][data-part="link"]')
  expect(links[0].tagName).toBe('A')
  expect(links[0].getAttribute('href')).toBe('/')
  expect(links[0].hasAttribute('aria-current')).toBe(false)
  expect(links[1].getAttribute('aria-current')).toBe('page')
  expect(links[1].hasAttribute('href')).toBe(false)
  expect(part('breadcrumbs', 'separator').getAttribute('aria-hidden')).toBe('true')
  const label = part('label', 'root')
  expect(label.tagName).toBe('LABEL')
  expect(label.getAttribute('for')).toBe('control')
  expect(host.querySelector('#control')?.tagName).toBe('INPUT')
  const separator = part('separator', 'root')
  expect(separator.getAttribute('role')).toBe('separator')
  expect(separator.getAttribute('aria-orientation')).toBe(vertical ? 'vertical' : 'horizontal')
  expect(separator.getAttribute('data-orientation')).toBe(vertical ? 'vertical' : 'horizontal')
  expect(separator.hasAttribute('tabindex')).toBe(false)
  window.happyDOM.abort()
}
