import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-svelte'
import { page, userEvent } from 'vitest/browser'
import Basic from '../examples/Basic.svelte'
import { Collapsible, collapsibleAnatomy } from '../index'

const componentExports = Collapsible as unknown as Record<string, unknown>
const partName = (part: string) => part.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)

describe('[collapsible] component', () => {
  it.each(collapsibleAnatomy.keys())('renders and exports the %s anatomy part', async (part) => {
    await render(Basic)
    expect(document.querySelector(`[data-scope="collapsible"][data-part="${partName(part)}"]`)).toBeInTheDocument()
    const exportName = `${part.charAt(0).toUpperCase()}${part.slice(1)}`
    expect(componentExports[exportName], `Collapsible.${exportName}`).toBeDefined()
  })

  it.each([
    { lazyMount: false, unmountOnExit: false, initiallyMounted: true },
    { lazyMount: true, unmountOnExit: false, initiallyMounted: false },
    { lazyMount: false, unmountOnExit: true, initiallyMounted: true },
    { lazyMount: true, unmountOnExit: true, initiallyMounted: false },
  ])(
    'controls presence with lazyMount=$lazyMount and unmountOnExit=$unmountOnExit',
    async ({ lazyMount, unmountOnExit, initiallyMounted }) => {
      await render(Basic, { props: { lazyMount, unmountOnExit } })
      const content = page.getByText('Content')
      if (initiallyMounted)
        await expect.element(content).not.toBeVisible()
      else
        await expect.element(content).not.toBeInTheDocument()

      await userEvent.click(page.getByRole('button', { name: 'Toggle' }))
      await expect.element(content).toBeVisible()
      await userEvent.click(page.getByRole('button', { name: 'Toggle' }))
      await vi.waitFor(async () => {
        if (unmountOnExit)
          await expect.element(content).not.toBeInTheDocument()
        else
          await expect.element(content).not.toBeVisible()
      })
    },
  )

  it('accepts an open value and keeps it bindable', async () => {
    await render(Basic, { props: { open: true } })
    await expect.element(page.getByText('Content')).toBeVisible()
    await userEvent.click(page.getByRole('button', { name: 'Toggle' }))
    await expect.element(page.getByText('Content')).not.toBeVisible()
  })

  it('forwards onExitComplete', async () => {
    const onExitComplete = vi.fn()
    await render(Basic, { props: { onExitComplete } })
    await userEvent.click(page.getByRole('button', { name: 'Toggle' }))
    await userEvent.click(page.getByRole('button', { name: 'Toggle' }))
    await vi.waitFor(() => expect(onExitComplete).toHaveBeenCalledOnce())
  })
})
