import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { page, userEvent } from 'vitest/browser'
import { Basic } from '../examples/Basic'

describe('[presence] component', () => {
  it('should control presence when not lazy mounting and not unmounting on exit', async () => {
    render(<Basic />)
    await expect.element(page.getByTestId('box')).not.toBeVisible()

    await userEvent.click(page.getByRole('button'))
    await vi.waitFor(() => expect(page.getByTestId('box')).toBeVisible())

    await userEvent.click(page.getByRole('button'))
    await vi.waitFor(async () => {
      await expect.element(page.getByTestId('box')).not.toBeVisible()
    })
  })

  it('should control presence when lazy mounting and not unmounting on exit', async () => {
    render(<Basic lazyMount />)
    await expect.element(page.getByTestId('box')).not.toBeInTheDocument()

    await userEvent.click(page.getByRole('button'))
    await vi.waitFor(async () => await expect.element(page.getByTestId('box')).toBeVisible())

    await userEvent.click(page.getByRole('button'))
    await vi.waitFor(async () => {
      await expect.element(page.getByTestId('box')).not.toBeVisible()
    })
  })

  it('should control presence when not lazy mounting and unmounting on exit ', async () => {
    render(<Basic unmountOnExit />)
    await expect.element(page.getByTestId('box')).not.toBeVisible()

    await userEvent.click(page.getByRole('button'))
    await vi.waitFor(async () => await expect.element(page.getByTestId('box')).toBeVisible())

    await userEvent.click(page.getByRole('button'))
    await vi.waitFor(async () => await expect.element(page.getByTestId('box')).not.toBeInTheDocument())
  })

  it('should control presence when lazy mounting and unmounting on exit', async () => {
    render(<Basic lazyMount unmountOnExit />)

    await expect.element(page.getByTestId('box')).not.toBeInTheDocument()

    await userEvent.click(page.getByRole('button'))
    await vi.waitFor(async () => await expect.element(page.getByTestId('box')).toBeVisible())

    await userEvent.click(page.getByRole('button'))
    await vi.waitFor(async () => await expect.element(page.getByTestId('box')).not.toBeInTheDocument())
  })
})
