import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-vue'
import { page, userEvent } from 'vitest/browser'
import { getExports, getParts } from '../../../../../../utils/test'
import Basic from '../examples/Basic.vue'
import { Calendar, calendarAnatomy } from '../index'

describe('[calendar] component', () => {
  it.each(getParts(calendarAnatomy))('should render part %s', async (part) => {
    render(Basic)
    expect(document.querySelector(part)).toBeInTheDocument()
  })

  it.each(getExports(calendarAnatomy))('should export %s', async (part) => {
    expect(Calendar[part]).toBeDefined()
  })

  it('should be able to lazy mount', async () => {
    render(Basic, {
      props: {
        lazyMount: true,
      },
    })

    await expect.element(page.getByTestId('positioner')).not.toBeInTheDocument()

    await userEvent.click(page.getByRole('button', { name: 'Open calendar' }))
    await expect.element(page.getByTestId('positioner')).toBeInTheDocument()

    await userEvent.click(page.getByRole('button', { name: 'Close calendar' }))
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

    await userEvent.click(page.getByRole('button', { name: 'Open calendar' }))
    await expect.element(page.getByTestId('positioner')).toBeInTheDocument()

    await userEvent.click(page.getByRole('button', { name: 'Close calendar' }))
    await vi.waitFor(async () => await expect.element(page.getByTestId('positioner')).not.toBeInTheDocument())
  })
})
