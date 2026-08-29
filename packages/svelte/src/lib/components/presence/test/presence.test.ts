import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-svelte'
import { page, userEvent } from 'vitest/browser'
import Basic from '../examples/Basic.svelte'

describe('[presence] component', () => {
  it.each([
    { lazyMount: false, unmountOnExit: false, initiallyMounted: true },
    { lazyMount: true, unmountOnExit: false, initiallyMounted: false },
    { lazyMount: false, unmountOnExit: true, initiallyMounted: true },
    { lazyMount: true, unmountOnExit: true, initiallyMounted: false },
  ])(
    'controls presence with lazyMount=$lazyMount and unmountOnExit=$unmountOnExit',
    async ({ lazyMount, unmountOnExit, initiallyMounted }) => {
      await render(Basic, { props: { lazyMount, unmountOnExit } })
      const box = page.getByTestId('box')

      if (initiallyMounted)
        await expect.element(box).not.toBeVisible()
      else
        await expect.element(box).not.toBeInTheDocument()

      await userEvent.click(page.getByRole('button', { name: 'Toggle' }))
      await vi.waitFor(async () => expect.element(box).toBeVisible())

      await userEvent.click(page.getByRole('button', { name: 'Toggle' }))
      await vi.waitFor(async () => {
        if (unmountOnExit)
          await expect.element(box).not.toBeInTheDocument()
        else
          await expect.element(box).not.toBeVisible()
      })
    },
  )
})
