import { expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'

// https://github.com/destyler/destyler/blob/3f019168108f75a93587cc2bca146d87b119949b/document/src/content/guide/primitive-contracts.mdx
// Each fixture renders these cases in separate trails, with one current page per trail.
export const contractItems = [
  { id: 'home', label: 'Home', href: '/' },
  { id: 'current-link', label: 'Current destination', href: '/current', current: true },
  { id: 'static', label: 'Static category', current: false },
  { id: 'inferred', label: 'Inferred current' },
  { id: 'current-text', label: 'Explicit current text', current: true },
]

export interface ContractOptions {
  orientation: 'horizontal' | 'vertical'
  locale: string
}

export function core033Contracts(mount: (options: ContractOptions) => unknown | Promise<unknown>) {
  it('keeps destination links native and no-href items outside keyboard navigation', async () => {
    await mount({ orientation: 'horizontal', locale: 'en-US' })
    const links = Array.from(document.querySelectorAll<HTMLElement>('[data-scope="breadcrumbs"][data-part="link"]'))
    expect(links).toHaveLength(5)
    expect(links[0].getAttribute('href')).toBe('/')
    expect(links[0].hasAttribute('aria-current')).toBe(false)
    expect(links[1].getAttribute('href')).toBe('/current')
    for (const index of [1, 3, 4]) {
      expect(links[index].getAttribute('aria-current')).toBe('page')
      expect(links[index].getAttribute('data-current')).toBe('page')
    }
    expect(links[2].hasAttribute('aria-current')).toBe(false)
    expect(links[2].hasAttribute('data-current')).toBe(false)
    for (const link of links.slice(2)) {
      expect(link.hasAttribute('href')).toBe(false)
      expect(link.getAttribute('role')).not.toBe('link')
      expect(link.hasAttribute('tabindex')).toBe(false)
    }
    links[0].focus()
    await userEvent.tab()
    expect(document.activeElement).toBe(links[1])
    await userEvent.tab()
    expect(document.activeElement?.getAttribute('data-testid')).toBe('after-breadcrumbs')
  })

  it('allows theme CSS to color the thumb while preserving native scroll geometry', async () => {
    await mount({ orientation: 'horizontal', locale: 'en-US' })
    const thumb = document.querySelector<HTMLElement>('[data-scope="scroll-area"][data-part="thumb"]')!
    const viewport = document.querySelector<HTMLElement>('[data-scope="scroll-area"][data-part="viewport"]')!
    const theme = document.createElement('style')
    theme.textContent = '[data-scope="scroll-area"][data-part="thumb"] { background-color: rgb(18, 92, 160); }'
    document.head.append(theme)
    try {
      expect(thumb.style.backgroundColor).toBe('')
      await expect.poll(() => getComputedStyle(thumb).backgroundColor).toBe('rgb(18, 92, 160)')
      expect(thumb.getAttribute('data-orientation')).toBe('vertical')
      await expect.poll(() => thumb.getBoundingClientRect().height).toBeGreaterThan(0)
      const before = thumb.getBoundingClientRect().top
      viewport.scrollTop = 120
      await expect.poll(() => viewport.scrollTop).toBe(120)
      await expect.poll(() => thumb.getBoundingClientRect().top).toBeGreaterThan(before)
      expect(thumb.getBoundingClientRect().height).toBeLessThan(viewport.clientHeight)
    }
    finally {
      theme.remove()
    }
  })

  it.each([
    { orientation: 'horizontal' as const, locale: 'en-US', key: '{ArrowRight}', delta: 1 },
    { orientation: 'horizontal' as const, locale: 'ar', key: '{ArrowRight}', delta: -1 },
    { orientation: 'vertical' as const, locale: 'en-US', key: '{ArrowDown}', delta: 1 },
    { orientation: 'vertical' as const, locale: 'ar', key: '{ArrowDown}', delta: 1 },
  ])('separates ARIA from $orientation layout and preserves $locale keyboard resizing', async ({ orientation, locale, key, delta }) => {
    await mount({ orientation, locale })
    const trigger = document.querySelector<HTMLElement>('[data-scope="splitter"][data-part="resize-trigger"]')!
    const panel = document.querySelector<HTMLElement>('[data-scope="splitter"][data-part="panel"]')!
    expect(trigger.getAttribute('role')).toBe('separator')
    expect(trigger.getAttribute('aria-orientation')).toBe(orientation === 'horizontal' ? 'vertical' : 'horizontal')
    expect(trigger.getAttribute('data-orientation')).toBe(orientation)
    expect(trigger.getAttribute('dir')).toBe(locale === 'ar' ? 'rtl' : 'ltr')
    expect(Number(panel.style.flexGrow)).toBe(50)
    trigger.focus()
    await userEvent.keyboard(key)
    await expect.poll(() => Number(panel.style.flexGrow)).toBe(50 + delta)
    expect(trigger.getAttribute('data-orientation')).toBe(orientation)
  })
}
