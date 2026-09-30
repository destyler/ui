import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { page, userEvent } from 'vitest/browser'
import { getExports, getParts } from '../../../../../../utils/test'
import { Basic } from '../examples/Basic'
import { CloseBehavior } from '../examples/CloseBehavior'
import { InitialOpen } from '../examples/InitialOpen'
import { Popover, popoverAnatomy } from '../index'

describe('[popover] component', () => {
  it.each(getParts(popoverAnatomy))('should render part %s', async (part) => {
    render(<Basic />)
    expect(document.querySelector(part)).toBeInTheDocument()
  })

  it.each(getExports(popoverAnatomy))('should export %s', async (part) => {
    expect(Popover).toHaveProperty(part, expect.anything())
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

  it('seeds default* via InitialOpen example', async () => {
    render(<InitialOpen />)
    await expect.element(page.getByText('title')).toBeVisible()
  })

  it('honors disabled Escape and outside dismissal while allowing explicit close', async () => {
    await render(<><button type="button">Outside</button><CloseBehavior /></>)
    await userEvent.click(page.getByRole('button', { name: 'Click Me' }))
    const content = page.getByRole('dialog', { includeHidden: true })
    await expect.element(content).toBeVisible()
    await userEvent.keyboard('{Escape}')
    await expect.element(content).toBeVisible()
    await userEvent.click(page.getByRole('button', { name: 'Outside' }))
    await expect.element(content).toBeVisible()
    const closeTrigger = page.getByRole('button', { name: 'close', exact: true })
    await expect.element(closeTrigger).toHaveTextContent('Close')
    await userEvent.click(closeTrigger)
    await expect.element(content).toHaveAttribute('data-state', 'closed')
    await expect.element(content).not.toBeVisible()
  })
})
