import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { page, userEvent } from 'vitest/browser'
import { getExports, getParts } from '../../../../../../utils/test'
import { Basic } from '../examples/Basic'
import { Collapsible, collapsibleAnatomy } from '../index'

describe('[collapsible] parts & exports', () => {
  it.each(getParts(collapsibleAnatomy))('should render part %s', async (part) => {
    render(<Basic />)
    expect(document.querySelector(part)).toBeInTheDocument()
  })

  it.each(getExports(collapsibleAnatomy))('should export %s', async (part) => {
    render(<Basic />)
    expect(Collapsible[part]).toBeDefined()
  })
})

describe('[collapsible] components', () => {
  it('should toggle', async () => {
    render(<Basic />)

    await expect.element(page.getByText('Content')).not.toBeVisible()

    await userEvent.click(page.getByRole('button', { name: 'Toggle' }))
    await expect.element(page.getByText('Content')).toBeVisible()
  })

  it('should be fully controlled (true)', async () => {
    render(<Basic open={true} />)

    await userEvent.click(page.getByRole('button', { name: 'Toggle' }))
    await expect.element(page.getByText('Content')).toBeVisible()
  })

  it('should be fully controlled (false)', async () => {
    render(<Basic open={false} />)

    await userEvent.click(page.getByRole('button', { name: 'Toggle' }))
    await vi.waitFor(() => expect(page.getByText('Content')).not.toBeVisible())
  })

  it('should lazy mount', async () => {
    render(<Basic lazyMount />)
    expect(page.getByText('Content')).not.toBeInTheDocument()

    await userEvent.click(page.getByRole('button', { name: 'Toggle' }))
    expect(page.getByText('Content')).toBeVisible()
  })

  it('should unmount on exit ', async () => {
    render(<Basic unmountOnExit />)
    expect(page.getByText('Content')).not.toBeVisible()

    await userEvent.click(page.getByRole('button', { name: 'Toggle' }))
    expect(page.getByText('Content')).toBeVisible()

    await userEvent.click(page.getByRole('button'))
    await vi.waitFor(() => expect(page.getByText('Content')).not.toBeInTheDocument())
  })

  it('should lazy mount and unmount on exit', async () => {
    render(<Basic lazyMount unmountOnExit />)

    expect(page.getByText('Content')).not.toBeInTheDocument()

    await userEvent.click(page.getByRole('button', { name: 'Toggle' }))
    expect(page.getByText('Content')).toBeVisible()

    await userEvent.click(page.getByRole('button', { name: 'Toggle' }))
    await vi.waitFor(() => expect(page.getByText('Content')).not.toBeInTheDocument())
  })
})
