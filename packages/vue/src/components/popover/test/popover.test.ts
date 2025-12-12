import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-vue'
import { page, userEvent } from 'vitest/browser'
import { getExports, getParts } from '../../../../../../utils/test'
import Basic from '../examples/Basic.vue'
import Controlled from '../examples/Controlled.vue'
import { Popover, popoverAnatomy } from '../index'

describe('[popover] component', () => {
  it.each(getParts(popoverAnatomy))('should render part %s', async (part) => {
    render(Basic)
    expect(document.querySelector(part)).toBeInTheDocument()
  })

  it.each(getExports(popoverAnatomy))('should export %s', async (part) => {
    expect(Popover[part]).toBeDefined()
  })

  it('should open and close the popover', async () => {
    render(Basic)

    await userEvent.click(page.getByText('click me'))
    await expect.element(page.getByRole('dialog')).toBeInTheDocument()

    await userEvent.click(page.getByText('close'))
    await vi.waitFor(async () => await expect.element(page.getByText('title')).not.toBeVisible())
  })

  it.skip('should hide the popover when escape is pressed', async () => {
    render(Basic)

    await userEvent.click(page.getByText('click me'))
    await expect.element(page.getByRole('dialog')).toBeInTheDocument()

    await userEvent.keyboard('[Escape]')
    await vi.waitFor(async () => await expect.element(page.getByText('title')).not.toBeVisible())
  })

  it('should focus the first focusable element', async () => {
    render(Basic)

    await userEvent.click(page.getByText('click me'))
    await expect.element(page.getByRole('dialog')).toBeInTheDocument()
  })

  it.skip('should allow controlled usage', async () => {
    render(Controlled)

    await expect.element(page.getByText('title')).not.toBeVisible()

    await userEvent.click(page.getByRole('button', { name: /toggle/i }))
    await expect.element(page.getByRole('dialog')).toBeInTheDocument()
    await expect.element(page.getByText('title')).toBeVisible()

    await userEvent.click(page.getByRole('button', { name: /toggle/i }))
    await vi.waitFor(async () => await expect.element(page.getByText('title')).not.toBeVisible())
  })

  it('should be able to lazy mount', async () => {
    render(Basic, {
      props: {
        lazyMount: true,
      },
    })

    await expect.element(page.getByTestId('positioner')).not.toBeInTheDocument()

    await userEvent.click(page.getByRole('button', { name: 'click me' }))
    await expect.element(page.getByTestId('positioner')).toBeInTheDocument()

    await userEvent.click(page.getByRole('button', { name: 'close' }))
    await expect.element(page.getByTestId('positioner')).toBeInTheDocument()
  })

  it('should lazy mount and unmount on exit', async () => {
    render(Basic, {
      props: {
        lazyMount: true,
        unmountOnExit: true,
      },
    })

    await expect.element(page.getByTestId('positioner')).not.toBeInTheDocument()

    await userEvent.click(page.getByRole('button', { name: 'click me' }))
    await expect.element(page.getByTestId('positioner')).toBeInTheDocument()

    await userEvent.click(page.getByRole('button', { name: 'close' }))
    await vi.waitFor(async () => await expect.element(page.getByTestId('positioner')).not.toBeInTheDocument())
  })
})
