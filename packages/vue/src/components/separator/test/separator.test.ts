import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import { getExports, getParts } from '../../../../../../utils/test'
import Basic from '../examples/Basic.vue'
import RootProvider from '../examples/RootProvider.vue'
import Vertical from '../examples/Vertical.vue'
import { Separator, separatorAnatomy } from '../index'

describe('[separator] component', () => {
  it.each(getParts(separatorAnatomy))('should render part %s', async (part) => {
    await render(Basic)
    expect(document.querySelector(part)).toBeInTheDocument()
  })

  it.each(getExports(separatorAnatomy))('should export %s', async (part) => {
    expect(Separator).toHaveProperty(part, expect.anything())
  })

  it('should render horizontal separator by default', async () => {
    await render(Basic)
    const separator = document.querySelector('[data-scope="separator"][data-part="root"]')
    expect(separator).toBeInTheDocument()
    expect(separator).toHaveAttribute('data-orientation', 'horizontal')
  })

  it('should render vertical separator', async () => {
    await render(Vertical)
    const separator = document.querySelector('[data-scope="separator"][data-part="root"][data-orientation="vertical"]')
    expect(separator).toBeInTheDocument()
  })

  it('should work with RootProvider', async () => {
    await render(RootProvider)
    const separator = document.querySelector('[data-scope="separator"][data-part="root"]')
    expect(separator).toBeInTheDocument()
  })

  it('should have correct ARIA role', async () => {
    await render(Basic)
    const separator = document.querySelector('[data-scope="separator"][data-part="root"]')
    expect(separator).toHaveAttribute('role', 'separator')
  })

  it('should have aria-orientation attribute', async () => {
    await render(Vertical)
    const separator = document.querySelector('[data-scope="separator"][data-part="root"][data-orientation="vertical"]')
    expect(separator).toHaveAttribute('aria-orientation', 'vertical')
  })
})
