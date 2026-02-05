import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { page, userEvent } from 'vitest/browser'
import { getExports, getParts } from '../../../../../../utils/test'
import { Basic } from '../examples/Basic'
import { Popover, popoverAnatomy } from '../index'

describe('[popover] component', () => {
  it.each(getParts(popoverAnatomy))('should render part %s', async (part) => {
    render(<Basic />)
    expect(document.querySelector(part)).toBeInTheDocument()
  })

  it.each(getExports(popoverAnatomy))('should export %s', async (part) => {
    expect(Popover[part]).toBeDefined()
  })

  it('should focus the first focusable element', async () => {
    render(<Basic />)

    await userEvent.click(page.getByText('click me'))
    await expect.element(page.getByRole('dialog')).toBeInTheDocument()
  })

  it('should be able to lazy mount', async () => {
    render(<Basic lazyMount />)

    await expect.element(page.getByTestId('positioner')).not.toBeInTheDocument()

    await userEvent.click(page.getByRole('button', { name: 'click me' }))
    await expect.element(page.getByTestId('positioner')).toBeInTheDocument()

    await userEvent.click(page.getByRole('button', { name: 'close' }))
    await expect.element(page.getByTestId('positioner')).toBeInTheDocument()
  })
})
