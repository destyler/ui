import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-svelte'
import { userEvent } from 'vitest/browser'
import Basic from '../examples/Basic.svelte'
import { Tree, treeAnatomy } from '../index'

const componentExports = Tree as unknown as Record<string, unknown>
const partName = (part: string) => part.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)

describe('[tree] component', () => {
  it.each(treeAnatomy.keys())('renders and exports the %s anatomy part', async (part) => {
    const screen = await render(Basic)
    expect(screen.container.querySelector(`[data-scope="tree-view"][data-part="${partName(part)}"]`)).toBeInTheDocument()
    const exportName = `${part.charAt(0).toUpperCase()}${part.slice(1)}`
    expect(componentExports[exportName], `Tree.${exportName}`).toBeDefined()
  })

  it('expands and collapses branches', async () => {
    const screen = await render(Basic)
    const branch = screen.getByText('node_modules').element().closest('[data-part="branch"]')
    const trigger = branch?.querySelector<HTMLElement>('[data-part="branch-trigger"]')
    const content = branch?.querySelector<HTMLElement>('[data-part="branch-content"]')
    expect(trigger).not.toBeNull()
    expect(content).not.toBeVisible()
    await userEvent.click(trigger!)
    await vi.waitFor(() => expect(content).toBeVisible())
    await expect.element(screen.getByText('destyler')).toBeVisible()
    await userEvent.click(trigger!)
    await vi.waitFor(() => expect(content).not.toBeVisible())
  })

  it('selects leaf items and moves focus with the keyboard', async () => {
    const screen = await render(Basic)
    const packageItem = screen.getByText('package.json').element().closest<HTMLElement>('[data-part="item"]')
    expect(packageItem).not.toBeNull()
    await userEvent.click(packageItem!)
    await vi.waitFor(() => expect(packageItem).toHaveAttribute('data-selected'))
    await packageItem!.focus()
    await userEvent.keyboard('{ArrowDown}')
    const renovateItem = screen.getByText('renovate.json').element().closest('[data-part="item"]')
    await vi.waitFor(() => expect(renovateItem).toHaveAttribute('data-focus'))
  })
})
