import type { Component } from 'svelte'
import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-svelte'
import { userEvent } from 'vitest/browser'
import AutoPlay from '../examples/AutoPlay.svelte'
import Basic from '../examples/Basic.svelte'
import Controlled from '../examples/Controlled.svelte'
import RootProvider from '../examples/RootProvider.svelte'
import { Carousel, carouselAnatomy } from '../index'

const componentExports = Carousel as unknown as Record<string, unknown>
const partName = (part: string) => part.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)

describe('[carousel] component', () => {
  it.each(carouselAnatomy.keys())('renders and exports the %s anatomy part', async (part) => {
    const screen = await render(Basic)
    expect(screen.container.querySelector(`[data-scope="carousel"][data-part="${partName(part)}"]`)).toBeInTheDocument()
    const exportName = `${part.charAt(0).toUpperCase()}${part.slice(1)}`
    expect(componentExports[exportName], `Carousel.${exportName}`).toBeDefined()
  })

  it('sets the correct initial control states and advances', async () => {
    const screen = await render(Basic)
    const previous = screen.getByRole('button', { name: 'Previous' })
    const next = screen.getByRole('button', { name: 'Next' })
    await vi.waitFor(async () => expect.element(previous).toBeDisabled())
    await vi.waitFor(async () => expect.element(next).toBeEnabled())
    await userEvent.click(next)
    await vi.waitFor(async () => expect.element(previous).toBeEnabled())
    const second = screen.container.querySelector('[data-part="item"][data-index="1"]')
    expect(second).toHaveAttribute('data-inview')
  })

  it('synchronizes controlled and RootProvider controls', async () => {
    const controlled = await render(Controlled)
    await userEvent.click(controlled.getByRole('button', { name: 'Next' }))
    await expect.element(controlled.getByRole('status')).toHaveTextContent('1')
    controlled.unmount()

    const provider = await render(RootProvider)
    await userEvent.click(provider.getByRole('button', { name: 'Scroll to #3' }))
    await vi.waitFor(() => {
      const third = provider.container.querySelector('[data-part="item"][data-index="2"]')
      expect(third).toHaveAttribute('data-inview')
    })
  })

  it.each([
    ['Basic', Basic],
    ['AutoPlay', AutoPlay],
    ['Controlled', Controlled],
    ['RootProvider', RootProvider],
  ] as const)('keeps the %s slide image presentation consistent', async (_, component) => {
    const screen = await render(component as Component<any>)
    const images = screen.container.querySelectorAll<HTMLImageElement>('[data-part="item"] img')
    expect(images).toHaveLength(5)
    for (const image of images) {
      expect(image.alt).toBe('')
      expect(image.style.height).toBe('300px')
      expect(image.style.width).toBe('100%')
      expect(image.style.objectFit).toBe('cover')
    }
  })
})
