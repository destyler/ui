import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-svelte'
import { page, userEvent } from 'vitest/browser'
import Basic from '../examples/Basic.svelte'
import { Tabs, tabsAnatomy } from '../index'

const componentExports = Tabs as unknown as Record<string, unknown>
const partName = (part: string) => part.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)

describe('[tabs] component', () => {
  it.each(tabsAnatomy.keys())('renders and exports the %s anatomy part', async (part) => {
    await render(Basic)
    expect(document.querySelector(`[data-scope="tabs"][data-part="${partName(part)}"]`)).toBeInTheDocument()
    const exportName = `${part.charAt(0).toUpperCase()}${part.slice(1)}`
    expect(componentExports[exportName], `Tabs.${exportName}`).toBeDefined()
  })

  it('renders default content and reports activation', async () => {
    const onValueChange = vi.fn()
    await render(Basic, { props: { defaultValue: 'React', onValueChange } })
    await expect.element(page.getByText('React Content')).toBeVisible()
    await userEvent.click(page.getByText('Solid Trigger'))
    expect(onValueChange).toHaveBeenCalledWith({ value: 'Solid' })
    await expect.element(page.getByText('Solid Content')).toBeVisible()
  })

  it('skips a disabled tab during keyboard navigation', async () => {
    await render(Basic)
    const solid = page.getByText('Solid Trigger')
    const disabled = page.getByText('Svelte Trigger')
    const vue = page.getByText('Vue Trigger')
    await userEvent.click(solid)
    await userEvent.keyboard('[ArrowRight]')
    await vi.waitFor(async () => expect.element(vue).toHaveFocus())
    await expect.element(disabled).not.toHaveFocus()
    await expect.element(page.getByText('Svelte Content')).not.toBeVisible()
  })

  it('loops focus by default and respects loopFocus=false', async () => {
    const screen = await render(Basic)
    await userEvent.click(screen.getByText('Vue Trigger'))
    await userEvent.keyboard('[ArrowRight]')
    await expect.element(screen.getByText('React Trigger')).toHaveFocus()
    screen.unmount()

    await render(Basic, { props: { loopFocus: false } })
    const last = page.getByText('Vue Trigger')
    await userEvent.click(last)
    await userEvent.keyboard('[ArrowRight]')
    await expect.element(last).toHaveFocus()
  })

  it('uses ArrowDown for vertical orientation', async () => {
    await render(Basic, { props: { orientation: 'vertical' } })
    const first = page.getByText('React Trigger')
    await userEvent.click(first)
    await userEvent.keyboard('[ArrowDown]')
    await expect.element(page.getByText('Solid Trigger')).toHaveFocus()
  })

  it('lazy mounts content and keeps it mounted by default', async () => {
    await render(Basic, { props: { lazyMount: true } })
    const content = page.getByText('React Content')
    await expect.element(content).not.toBeInTheDocument()
    await userEvent.click(page.getByText('React Trigger'))
    await expect.element(content).toBeVisible()
    await userEvent.click(page.getByText('Solid Trigger'))
    await expect.element(content).toBeInTheDocument()
  })

  it('lazy mounts and unmounts on exit', async () => {
    await render(Basic, { props: { lazyMount: true, unmountOnExit: true } })
    const content = page.getByText('React Content')
    await expect.element(content).not.toBeInTheDocument()
    await userEvent.click(page.getByText('React Trigger'))
    await expect.element(content).toBeVisible()
    await userEvent.click(page.getByText('Solid Trigger'))
    await vi.waitFor(async () => expect.element(content).not.toBeInTheDocument())
  })
})
