import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import { page } from 'vitest/browser'
import Basic from '../examples/Basic.svelte'
import Portrait from '../examples/Portrait.svelte'
import RootProvider from '../examples/RootProvider.svelte'
import Square from '../examples/Square.svelte'
import { AspectRatio, aspectRatioAnatomy } from '../index'

const componentExports = AspectRatio as unknown as Record<string, unknown>

describe('[aspect-ratio] component', () => {
  it.each(aspectRatioAnatomy.keys())('renders and exports the %s anatomy part', async (part: string) => {
    const screen = await render(Basic)
    expect(screen.container.querySelector(`[data-scope="aspect-ratio"][data-part="${part}"]`)).toBeInTheDocument()
    const exportName = `${part.charAt(0).toUpperCase()}${part.slice(1)}`
    expect(componentExports[exportName], `AspectRatio.${exportName}`).toBeDefined()
  })

  it.each([
    ['16:9', Basic, 'img'],
    ['1:1', Square, '1:1'],
    ['9:16', Portrait, 'img'],
    ['RootProvider', RootProvider, 'img'],
  ] as const)('renders the %s example', async (_, component, content) => {
    await render(component)
    if (content === 'img')
      await expect.element(page.getByRole('img')).toBeVisible()
    else
      await expect.element(page.getByText(content)).toBeVisible()
  })

  it.each([
    ['Basic', Basic, '300px'],
    ['Portrait', Portrait, '200px'],
    ['RootProvider', RootProvider, '300px'],
  ] as const)('keeps the %s wrapper and image styles aligned with React', async (_, component, width) => {
    const screen = await render(component)
    const main = screen.container.querySelector<HTMLElement>(':scope > main')
    const image = screen.container.querySelector<HTMLImageElement>('img')
    expect(main?.style.width).toBe(width)
    expect(image?.style.width).toBe('100%')
    expect(image?.style.height).toBe('100%')
    expect(image?.style.objectFit).toBe('cover')
  })

  it('keeps the square presentation styles aligned with React', async () => {
    const screen = await render(Square)
    const content = screen.container.querySelector<HTMLElement>('[data-part="content"] > div')
    expect(content?.style.display).toBe('flex')
    expect(content?.style.background).toContain('linear-gradient')
    expect(content?.style.fontSize).toBe('24px')
  })
})
