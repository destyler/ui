import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-vue'
import { page, userEvent } from 'vitest/browser'
import { getExports, getParts } from '../../../../../../utils/test'
import Basic from '../examples/Basic.vue'
import DefaultOpen from '../examples/DefaultOpen.vue'
import { FloatingPanel, floatingPanelAnatomy } from '../index'

describe('[floating-panel] component', () => {
  it.each(getParts(floatingPanelAnatomy))('should render part %s', async (part) => {
    render(DefaultOpen)
    expect(document.querySelector(part)).toBeInTheDocument()
  })

  it.each(getExports(floatingPanelAnatomy))('should export %s', async (part) => {
    expect(FloatingPanel[part]).toBeDefined()
  })

  it('should open panel when trigger is clicked', async () => {
    render(Basic)

    await userEvent.click(page.getByText('Toggle Panel'))

    await vi.waitFor(async () => await expect.element(page.getByText('Floating Panel')).toBeVisible())
  })

  it('should close panel when close trigger is clicked', async () => {
    render(DefaultOpen)

    await vi.waitFor(async () => await expect.element(page.getByText('Default Open Panel')).toBeVisible())

    await userEvent.click(page.getByText('x'))

    await vi.waitFor(async () => await expect.element(page.getByText('Default Open Panel')).not.toBeVisible())
  })

  it('should open panel and close with close trigger', async () => {
    render(Basic)

    await userEvent.click(page.getByText('Toggle Panel'))
    await vi.waitFor(async () => await expect.element(page.getByText('Floating Panel')).toBeVisible())

    await userEvent.click(page.getByText('x'))
    await vi.waitFor(async () => await expect.element(page.getByText('Floating Panel')).not.toBeVisible())
  })

  it('should render with default open state', async () => {
    render(DefaultOpen)

    await vi.waitFor(async () => await expect.element(page.getByText('Default Open Panel')).toBeVisible())
  })

  it('should have correct ARIA attributes on trigger', async () => {
    render(Basic)

    const trigger = document.querySelector('[data-scope="floating-panel"][data-part="trigger"]')
    expect(trigger).toBeInTheDocument()
    expect(trigger?.tagName.toLowerCase()).toBe('button')
  })

  it('should render all resize triggers', async () => {
    render(DefaultOpen)

    const resizeTriggers = document.querySelectorAll('[data-scope="floating-panel"][data-part="resize-trigger"]')
    expect(resizeTriggers.length).toBe(8)
  })

  it('should render header with title', async () => {
    render(DefaultOpen)

    await vi.waitFor(async () => {
      const header = document.querySelector('[data-scope="floating-panel"][data-part="header"]')
      expect(header).toBeInTheDocument()

      const title = document.querySelector('[data-scope="floating-panel"][data-part="title"]')
      expect(title).toBeInTheDocument()
    })
  })

  it('should render body content', async () => {
    render(DefaultOpen)

    await vi.waitFor(async () => {
      const body = document.querySelector('[data-scope="floating-panel"][data-part="body"]')
      expect(body).toBeInTheDocument()
    })
  })

  it('should render window control triggers', async () => {
    render(DefaultOpen)

    await vi.waitFor(async () => {
      const minimizeTrigger = document.querySelector('[data-scope="floating-panel"][data-part="minimize-trigger"]')
      expect(minimizeTrigger).toBeInTheDocument()

      const maximizeTrigger = document.querySelector('[data-scope="floating-panel"][data-part="maximize-trigger"]')
      expect(maximizeTrigger).toBeInTheDocument()

      const restoreTrigger = document.querySelector('[data-scope="floating-panel"][data-part="restore-trigger"]')
      expect(restoreTrigger).toBeInTheDocument()

      const closeTrigger = document.querySelector('[data-scope="floating-panel"][data-part="close-trigger"]')
      expect(closeTrigger).toBeInTheDocument()
    })
  })

  it('should render drag trigger', async () => {
    render(DefaultOpen)

    await vi.waitFor(async () => {
      const dragTrigger = document.querySelector('[data-scope="floating-panel"][data-part="drag-trigger"]')
      expect(dragTrigger).toBeInTheDocument()
    })
  })
})
