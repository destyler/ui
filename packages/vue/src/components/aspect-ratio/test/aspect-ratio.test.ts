import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import { page } from 'vitest/browser'
import { getExports, getParts } from '../../../../../../utils/test'
import Basic from '../examples/Basic.vue'
import Portrait from '../examples/Portrait.vue'
import RootProvider from '../examples/RootProvider.vue'
import Square from '../examples/Square.vue'
import { AspectRatio, aspectRatioAnatomy } from '../index'

// Keep image readiness independent of the external example image service.
const imageSrc = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"><rect width="32" height="32" fill="blue"/></svg>')}`
const imageProps = { src: imageSrc }

function expectAspectRatio(ratio: number) {
  const root = document.querySelector<HTMLElement>('[data-scope="aspect-ratio"][data-part="root"]')!
  const content = document.querySelector<HTMLElement>('[data-scope="aspect-ratio"][data-part="content"]')!
  const rootBox = root.getBoundingClientRect()
  const contentBox = content.getBoundingClientRect()

  expect(rootBox.width).toBeGreaterThan(0)
  expect(rootBox.height).toBeGreaterThan(0)
  expect(rootBox.width / rootBox.height, 'root aspect ratio').toBeCloseTo(ratio, 2)
  for (const dimension of ['x', 'y', 'width', 'height'] as const) {
    expect(contentBox[dimension], `content ${dimension}`).toBeCloseTo(rootBox[dimension], 0)
  }
}

describe('[aspect-ratio] component', () => {
  it.each(getParts(aspectRatioAnatomy))('should render part %s', async (part) => {
    await render(Basic, { props: imageProps })
    expect(document.querySelector(part)).toBeInTheDocument()
  })

  it.each(getExports(aspectRatioAnatomy))('should export %s', async (part) => {
    expect(AspectRatio).toHaveProperty(part, expect.anything())
  })

  it('should render 16:9 aspect ratio', async () => {
    await render(Basic, { props: imageProps })
    await expect.element(page.getByRole('img')).toBeVisible()
    expectAspectRatio(16 / 9)
    await expect.poll(() => document.querySelector('img')!.naturalWidth).toBe(32)
  })

  it('should render 1:1 square aspect ratio', async () => {
    await render(Square)
    await expect.element(page.getByText('1:1')).toBeVisible()
    expectAspectRatio(1)
  })

  it('should render 9:16 portrait aspect ratio', async () => {
    await render(Portrait, { props: imageProps })
    await expect.element(page.getByRole('img')).toBeVisible()
    expectAspectRatio(9 / 16)
    await expect.poll(() => document.querySelector('img')!.naturalWidth).toBe(32)
  })

  it('should work with RootProvider', async () => {
    await render(RootProvider, { props: imageProps })
    await expect.element(page.getByRole('img')).toBeVisible()
    expectAspectRatio(4 / 3)
    await expect.poll(() => document.querySelector('img')!.naturalWidth).toBe(32)
  })

  it('should detect an incorrect rendered ratio', async () => {
    await render(Basic, { props: imageProps })
    expectAspectRatio(16 / 9)

    const root = document.querySelector<HTMLElement>('[data-scope="aspect-ratio"][data-part="root"]')!
    root.style.paddingBottom = '100%'
    expect(() => expectAspectRatio(16 / 9)).toThrow('root aspect ratio')
  })

  it('should detect incorrect content positioning', async () => {
    await render(Basic, { props: imageProps })
    expectAspectRatio(16 / 9)

    const content = document.querySelector<HTMLElement>('[data-scope="aspect-ratio"][data-part="content"]')!
    content.style.left = '16px'
    expect(() => expectAspectRatio(16 / 9)).toThrow('content x')
  })
})
