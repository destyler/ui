import { expect, it } from 'vitest'
import mobileCandidate from '../src/components/MobileTableOfContents.astro?client-contract'
import mobileBaseline from '../src/components/MobileTableOfContents.astro?client-contract=baseline'
import desktopCandidate from '../src/components/TableOfContents.astro?client-contract'
import desktopBaseline from '../src/components/TableOfContents.astro?client-contract=baseline'

type Realm = Window & typeof globalThis

async function exercise(mobile: boolean, scripts: string[]) {
  expect(scripts).toHaveLength(1)
  const frame = document.createElement('iframe')
  frame.srcdoc = '<!doctype html><html><body></body></html>'
  const loaded = new Promise<void>(resolve => frame.addEventListener('load', () => resolve(), { once: true }))
  document.body.append(frame)
  try {
    await loaded
    const win = frame.contentWindow as Realm
    const doc = win.document
    const tag = mobile ? 'mobile-starlight-toc' : 'desktop-starlight-toc'
    doc.body.innerHTML = `<header></header><main><h1 id="_top">Top</h1><article class="sl-markdown-content"><h2 id="first">First</h2><p id="paragraph">Paragraph</p><h3 id="second">Second</h3><h2 id="unlisted">Unlisted</h2></article></main><${tag} data-min-h="2" data-max-h="3"><details><summary>Contents<span class="toc-display-current"></span></summary><nav><a href="#_top">Top</a><a href="#first">First</a><a href="#second">Second</a></nav></details></${tag}><button id="outside">Outside</button>`
    doc.querySelector('header')!.getBoundingClientRect = () => ({ height: 50 }) as DOMRect
    doc.querySelector('summary')!.getBoundingClientRect = () => ({ height: 20 }) as DOMRect
    Object.defineProperty(doc.documentElement, 'clientHeight', { value: 1000 })
    const idle: IdleRequestCallback[] = []
    win.requestIdleCallback = (callback) => {
      idle.push(callback)
      return idle.length
    }
    const observers: { callback: IntersectionObserverCallback, options: IntersectionObserverInit, targets: Element[] }[] = []
    win.IntersectionObserver = class {
      targets: Element[] = []
      constructor(public callback: IntersectionObserverCallback, public options: IntersectionObserverInit) {
        observers.push(this)
      }

      observe(target: Element) { this.targets.push(target) }
      disconnect() {}
    } as unknown as typeof IntersectionObserver
    const errors: string[] = []
    win.addEventListener('error', event => errors.push(event.message))
    // Execute the compiler's actual client script in the iframe's own realm.
    const script = doc.createElement('script')
    script.type = 'module'
    script.textContent = scripts[0]
    doc.body.append(script)
    await expect.poll(() => ({ idle: idle.length, errors })).toEqual({ idle: 1, errors: [] })
    idle.shift()!({ didTimeout: false, timeRemaining: () => 50 })
    expect(observers).toHaveLength(1)
    const observer = observers[0]
    expect(observer.options.rootMargin).toBe(mobile ? '-102px 0% -845px' : '-82px 0% -865px')
    expect(observer.targets).toContain(doc.getElementById('first'))
    const toc = doc.querySelector(tag)!
    const links = [...toc.querySelectorAll('a')]
    const writes: string[] = []
    for (const link of links) {
      const setAttribute = link.setAttribute.bind(link)
      link.setAttribute = (name, value) => {
        writes.push(`${link.hash}:${name}=${value}`)
        setAttribute(name, value)
      }
    }
    const report = (...ids: string[]) => observer.callback(ids.map((id) => {
      const target = doc.getElementById(id)!
      return {
        target,
        isIntersecting: true,
        intersectionRatio: 1,
        boundingClientRect: target.getBoundingClientRect(),
        intersectionRect: target.getBoundingClientRect(),
        rootBounds: null,
        time: 0,
      }
    }), observer as unknown as IntersectionObserver)
    report('first')
    expect(links[1].getAttribute('aria-current')).toBe('true')
    const firstCount = writes.length
    report('first')
    expect(writes).toHaveLength(firstCount)
    report('second', 'first')
    expect(links[2].getAttribute('aria-current')).toBe('true')
    expect(links[1].hasAttribute('aria-current')).toBe(false)
    report('paragraph')
    expect(links[1].getAttribute('aria-current')).toBe('true')
    report('unlisted', 'second')
    expect(links[2].getAttribute('aria-current')).toBe('true')
    expect(toc.querySelectorAll('[aria-current]')).toHaveLength(1)
    if (mobile) {
      expect(toc.querySelector('.toc-display-current')!.textContent).toBe('Second')
      const details = toc.querySelector('details')!
      details.open = true
      links[1].focus()
      win.dispatchEvent(new win.KeyboardEvent('keydown', { key: 'Escape' }))
      expect(details.open).toBe(false)
      expect(doc.activeElement).toBe(toc.querySelector('summary'))
      details.open = true
      doc.getElementById('outside')!.click()
      expect(details.open).toBe(false)
      details.open = true
      links[1].click()
      expect(details.open).toBe(false)
    }
    expect(errors).toEqual([])
    return { writes, current: toc.querySelector('[aria-current]')!.getAttribute('href'), margin: observer.options.rootMargin }
  }
  finally {
    frame.remove()
  }
}

it.each([
  { mobile: false, before: desktopBaseline, after: desktopCandidate },
  { mobile: true, before: mobileBaseline, after: mobileCandidate },
])('preserves native ToC behavior against actual baseline scripts (mobile=$mobile)', async ({ mobile, before, after }) => {
  expect(before).not.toEqual(after)
  expect(await exercise(mobile, after)).toEqual(await exercise(mobile, before))
})
