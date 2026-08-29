import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import Basic from '../examples/Basic.svelte'
import RootProvider from '../examples/RootProvider.svelte'
import Vertical from '../examples/Vertical.svelte'
import { Separator, separatorAnatomy } from '../index'

const componentExports = Separator as unknown as Record<string, unknown>

describe('[separator] component', () => {
  it.each(separatorAnatomy.keys())('renders and exports the %s anatomy part', async (part) => {
    const screen = await render(Basic)
    expect(screen.container.querySelector(`[data-scope="separator"][data-part="${part}"]`)).toBeInTheDocument()
    const exportName = `${part.charAt(0).toUpperCase()}${part.slice(1)}`
    expect(componentExports[exportName], `Separator.${exportName}`).toBeDefined()
  })

  it('renders a horizontal separator with the correct role by default', async () => {
    const screen = await render(Basic)
    const separator = screen.container.querySelector('[data-scope="separator"][data-part="root"]')
    const main = screen.container.querySelector('main') as HTMLElement
    const nav = screen.container.querySelector('nav') as HTMLElement
    expect(separator).toHaveAttribute('role', 'separator')
    expect(separator).toHaveAttribute('data-orientation', 'horizontal')
    expect(main.style.width).toBe('300px')
    expect(main.style.padding).toBe('1rem')
    expect(nav.style.display).toBe('flex')
    expect(nav.style.alignItems).toBe('center')
    expect(nav.style.gap).toBe('0.5rem')
    expect(nav.style.marginTop).toBe('1rem')
  })

  it('renders vertical separators with aria-orientation', async () => {
    const screen = await render(Vertical)
    const separators = screen.container.querySelectorAll('[data-orientation="vertical"]')
    expect(separators).toHaveLength(2)
    for (const separator of separators) {
      expect(separator).toHaveAttribute('aria-orientation', 'vertical')
      expect((separator as HTMLElement).style.height).toBe('1rem')
    }
    expect((screen.container.querySelector('main') as HTMLElement).style.padding).toBe('1rem')
    expect((screen.container.querySelector('nav') as HTMLElement).style.display).toBe('flex')
  })

  it('works through RootProvider', async () => {
    const screen = await render(RootProvider)
    expect(screen.container.querySelector('[data-scope="separator"][data-part="root"]')).toBeInTheDocument()
    const main = screen.container.querySelector('main') as HTMLElement
    expect(main.style.width).toBe('300px')
    expect(main.style.padding).toBe('1rem')
  })
})
