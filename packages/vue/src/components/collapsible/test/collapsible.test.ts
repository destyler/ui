import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-vue'
import { page, userEvent } from 'vitest/browser'
import Basic from '../examples/Basic.vue'
import LazyMount from '../examples/LazyMount.vue'
import LazyMountAndUnmountOnExit from '../examples/LazyMountAndUnmountOnExit.vue'
import UnmountOnExit from '../examples/UnmountOnExit.vue'

describe('[collapsible] components test', () => {
  it('should control presence when not lazy mounting and not unmounting on exit', async () => {
    render(Basic)

    await expect.element(page.getByText('Content')).not.toBeVisible()

    await userEvent.click(page.getByRole('button'))

    await expect.element(page.getByText('Content')).toBeVisible()

    await userEvent.click(page.getByRole('button'))

    await vi.waitFor(() => {
      expect(page.getByText('Content')).not.toBeVisible()
    })
  })

  it('should control presence when lazy mounting and not unmounting on exit', async () => {
    render(LazyMount)

    await expect.element(page.getByText('Content')).not.toBeInTheDocument()

    await userEvent.click(page.getByRole('button'))

    await expect.element(page.getByText('Content')).toBeVisible()

    await userEvent.click(page.getByRole('button'))

    await vi.waitFor(() => {
      expect(page.getByText('Content')).not.toBeVisible()
    })
  })

  it('should control presence when not lazy mounting and unmounting on exit ', async () => {
    render(UnmountOnExit)

    await expect.element(page.getByText('Content')).not.toBeVisible()

    await userEvent.click(page.getByRole('button'))

    await expect.element(page.getByText('Content')).toBeVisible()

    await userEvent.click(page.getByRole('button'))

    await vi.waitFor(() => {
      expect(page.getByText('Content')).not.toBeInTheDocument()
    })
  })

  it('should control presence when lazy mounting and unmounting on exit', async () => {
    render(LazyMountAndUnmountOnExit)

    await expect.element(page.getByText('Content')).not.toBeInTheDocument()

    await userEvent.click(page.getByRole('button'))

    await expect.element(page.getByText('Content')).toBeVisible()

    await userEvent.click(page.getByRole('button'))

    await vi.waitFor(() => {
      expect(page.getByText('Content')).not.toBeInTheDocument()
    })
  })
})
