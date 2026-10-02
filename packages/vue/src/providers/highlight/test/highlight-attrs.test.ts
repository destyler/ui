import type { App } from 'vue'
import type { HighlightProps } from '../index'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createApp, h, nextTick, reactive } from 'vue'
import { Highlight } from '../index'

let app: App | undefined
let host: HTMLDivElement | undefined

async function mount(props: HighlightProps & Record<string, unknown>) {
  const state = reactive(props)
  host = document.createElement('div')
  document.body.append(host)
  app = createApp({ render: () => h(Highlight, { ...state }) })
  app.mount(host)
  await nextTick()
  return state
}

function marks() {
  return Array.from(host!.querySelectorAll('mark'))
}

afterEach(() => {
  app?.unmount()
  host?.remove()
  app = undefined
  host = undefined
  vi.restoreAllMocks()
})

describe('vue Highlight mark attributes', () => {
  it('forwards ordinary attributes to every match without adding a wrapper', async () => {
    await mount({ 'text': 'one two one', 'query': 'one', 'matchAll': true, 'class': 'marked', 'style': { color: 'red' }, 'data-result': 'match', 'aria-label': 'search match' })
    expect(host!.textContent).toBe('one two one')
    expect(host!.children).toHaveLength(2)
    expect(marks().map(mark => mark.textContent)).toEqual(['one', 'one'])
    for (const mark of marks()) {
      expect(mark.className).toBe('marked')
      expect(mark.style.color).toBe('red')
      expect(mark.getAttribute('data-result')).toBe('match')
      expect(mark.getAttribute('aria-label')).toBe('search match')
      expect(mark.hasAttribute('query')).toBe(false)
      expect(mark.hasAttribute('text')).toBe(false)
      expect(mark.hasAttribute('matchall')).toBe(false)
    }
  })

  it('preserves listener arrays and each actual event target', async () => {
    const events: [string, Event, EventTarget | null][] = []
    await mount({ text: 'one one', query: 'one', matchAll: true, onClick: [(event: Event) => events.push(['first', event, event.currentTarget]), (event: Event) => events.push(['second', event, event.currentTarget])] })
    const nodes = marks()
    expect(nodes).toHaveLength(2)
    const clicks = nodes.map(() => new MouseEvent('click', { bubbles: true, cancelable: true }))
    nodes.forEach((node, index) => node.dispatchEvent(clicks[index]))
    expect(events.map(([name]) => name)).toEqual(['first', 'second', 'first', 'second'])
    events.forEach(([, event, target], index) => {
      expect(event).toBe(clicks[Math.floor(index / 2)])
      expect(target).toBe(nodes[Math.floor(index / 2)])
    })
  })

  it('replaces and removes attributes and handlers on reactive updates', async () => {
    const oldHandler = vi.fn()
    const newHandler = vi.fn()
    const state = await mount({ text: 'one one', query: 'one', matchAll: true, class: 'old', title: 'old title', onClick: oldHandler })
    const oldNodes = marks()
    state.class = 'new'
    state.title = undefined
    state.onClick = newHandler
    await nextTick()
    expect(marks()).toHaveLength(oldNodes.length)
    marks().forEach((mark, index) => expect(mark).toBe(oldNodes[index]))
    for (const mark of marks()) {
      expect(mark.className).toBe('new')
      expect(mark.hasAttribute('title')).toBe(false)
      mark.click()
    }
    expect(oldHandler).not.toHaveBeenCalled()
    expect(newHandler).toHaveBeenCalledTimes(2)
    state.onClick = undefined
    await nextTick()
    for (const mark of marks()) mark.click()
    expect(newHandler).toHaveBeenCalledTimes(2)
  })

  it('keeps unmatched and matched markup-like text literal', async () => {
    await mount({ text: '<b>one</b> & one', query: 'one', matchAll: true, class: 'literal' })
    expect(host!.textContent).toBe('<b>one</b> & one')
    expect(host!.querySelector('b')).toBeNull()
    expect(marks().map(mark => [mark.textContent, mark.className])).toEqual([['one', 'literal'], ['one', 'literal']])
  })

  it('retains plain text when there is no match and restores attrs when a match returns', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const state = await mount({ text: 'one one', query: 'missing', matchAll: true, class: 'restored' })
    expect(host!.textContent).toBe('one one')
    expect(host!.children).toHaveLength(0)
    state.query = 'one'
    await nextTick()
    expect(marks().map(mark => mark.className)).toEqual(['restored', 'restored'])
    state.query = 'missing'
    await nextTick()
    expect(host!.children).toHaveLength(0)
    expect(host!.textContent).toBe('one one')
    expect(warn).not.toHaveBeenCalled()
  })
})
