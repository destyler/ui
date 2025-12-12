import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-vue'
import { page, userEvent } from 'vitest/browser'
import { getExports, getParts } from '../../../../../../utils/test'
import Basic from '../examples/Basic.vue'
import { HoverCard, hoverCardAnatomy } from '../index'

describe('[hover-card] component', () => {
  it.each(getParts(hoverCardAnatomy))('should render part %s', async (part) => {
    render(Basic)
    expect(document.querySelector(part)).toBeInTheDocument()
  })

  it.each(getExports(hoverCardAnatomy))('should export %s', async (part) => {
    expect(HoverCard[part]).toBeDefined()
  })

  it('should open on hover', async () => {
    render(Basic)

    const target = page.getByText('Hover me')
    await userEvent.hover(target)

    const hoverContent = page.getByText('Content')
    await vi.waitFor(async () => await expect.element(hoverContent).toBeVisible())

    await userEvent.unhover(target)
    await vi.waitFor(async () => await expect.element(hoverContent).not.toBeVisible())
  })

  it('should invoke onOpenChange', async () => {
    const onOpenChange = vi.fn()
    render(Basic, { props: { onOpenChange } })

    await userEvent.hover(page.getByText('Hover me'))

    await vi.waitFor(async () => await expect.element(page.getByText('Content')).toBeVisible())
    expect(onOpenChange).toHaveBeenCalledTimes(1)
  })

  it('should lazy mount', async () => {
    render(Basic, { props: { lazyMount: true } })

    await expect.element(page.getByTestId('positioner')).not.toBeInTheDocument()

    await userEvent.hover(page.getByText('Hover me'))
    await expect.element(page.getByTestId('positioner')).toBeInTheDocument()
  })

  it('should lazy mount and unmount on exit', async () => {
    render(Basic, { props: { lazyMount: true, unmountOnExit: true } })

    await expect.element(page.getByTestId('positioner')).not.toBeInTheDocument()

    await userEvent.hover(page.getByText('Hover me'))
    await expect.element(page.getByTestId('positioner')).toBeInTheDocument()

    await userEvent.unhover(page.getByText('Hover me'))
    await vi.waitFor(async () => await expect.element(page.getByTestId('positioner')).not.toBeInTheDocument())
  })
})
