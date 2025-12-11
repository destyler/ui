import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-vue'
import { page } from 'vitest/browser'
import { Carousel, carouselAnatomy } from '~/index'
import { getExports, getParts } from '../../../../../../utils/test'
import Basic from '../examples/Basic.vue'

describe('[carousel] component', () => {
  it.each(getParts(carouselAnatomy))('should render part %s', async (part) => {
    render(Basic)
    expect(document.querySelector(part)).toBeInTheDocument()
  })

  it.each(getExports(carouselAnatomy))('should export %s', async (part) => {
    expect(Carousel[part]).toBeDefined()
  })

  it('should have the correct disabled / enabled states for control buttons', async () => {
    render(Basic)
    const prevButton = page.getByRole('button', { name: 'Previous slide' })
    const nextButton = page.getByRole('button', { name: 'Next slide' })

    await vi.waitFor(async () => await expect.element(prevButton).toBeDisabled())
    await vi.waitFor(async () => await expect.element(nextButton).toBeEnabled())
  })
})
