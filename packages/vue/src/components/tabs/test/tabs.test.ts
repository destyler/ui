import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-vue'
import { page, userEvent } from 'vitest/browser'
import { getExports, getParts } from '../../../../../../utils/test'
import Basic from '../examples/Basic.vue'
import { Tabs, tabsAnatomy } from '../index'

describe('[tabs] component', () => {
  it.each(getParts(tabsAnatomy))('should render part %s', async (part) => {
    render(Basic)
    expect(document.querySelector(part)).toBeInTheDocument()
  })

  it.each(getExports(tabsAnatomy))('should export %s', async (part) => {
    expect(Tabs[part]).toBeDefined()
  })

  it('should render the content of tab when active', async () => {
    render(Basic, { props: { defaultValue: 'React' } })

    await expect.element(page.getByText('React Content')).toBeVisible()
  })

  it('should activate tab on click', async () => {
    const onValueChange = vi.fn()
    render(Basic, { props: { onValueChange } })

    const tab = page.getByText('React Trigger')

    await userEvent.click(tab)
    expect(onValueChange).toHaveBeenCalledWith({ value: 'React' })
  })

  it('should not focus disabled tab', async () => {
    render(Basic)

    const solidTab = page.getByText('Solid Trigger')
    const disabledTab = page.getByText('Svelte Trigger')
    const disabledContent = page.getByText('Svelte Content')
    const nextTab = page.getByText('Vue Trigger')

    await userEvent.click(solidTab)
    await vi.waitFor(() => expect(solidTab).toHaveFocus())

    await userEvent.keyboard('[ArrowRight]')

    await vi.waitFor(async () => await expect.element(nextTab).toHaveFocus())
    await expect.element(disabledTab).not.toHaveFocus()
    await expect.element(disabledContent).not.toBeVisible()
  })

  it('should show content when tab is activated', async () => {
    render(Basic)

    const firstTab = page.getByText('React Trigger')
    const firstContent = page.getByText('React Content')

    await expect.element(firstContent).not.toBeVisible()

    await userEvent.click(firstTab)
    await expect.element(firstContent).toBeVisible()
  })

  it('should loop focus by default', async () => {
    render(Basic)

    const firstTab = page.getByText('React Trigger')
    const lastTab = page.getByText('Vue Trigger')

    await userEvent.click(lastTab)
    await vi.waitFor(() => expect(lastTab).toHaveFocus())

    await userEvent.keyboard('[ArrowRight]')
    await vi.waitFor(() => expect(firstTab).toHaveFocus())
  })

  it('should not loop focus if loop is false', async () => {
    render(Basic, { props: { loopFocus: false } })

    const lastTab = page.getByText('Vue Trigger')

    await userEvent.click(lastTab)
    await vi.waitFor(async () => await expect.element(lastTab).toHaveFocus())

    await userEvent.keyboard('[ArrowRight]')
    await vi.waitFor(async () => await expect.element(lastTab).toHaveFocus())
  })

  it('should handle orientation', async () => {
    render(Basic, { props: { orientation: 'vertical' } })

    const firstTab = page.getByText('React Trigger')
    const secondTab = page.getByText('Solid Trigger')

    await userEvent.click(firstTab)
    await vi.waitFor(async () => await expect.element(firstTab).toHaveFocus())

    await userEvent.keyboard('[ArrowDown]')
    await vi.waitFor(async () => await expect.element(secondTab).toHaveFocus())
  })

  it('should lazy mount a tab', async () => {
    render(Basic, { props: { lazyMount: true } })

    await expect.element(page.getByText('React Content')).not.toBeInTheDocument()

    await userEvent.click(page.getByText('React Trigger'))
    await expect.element(page.getByText('React Content')).toBeInTheDocument()
  })

  it('should lazy mount and unmount on exit a tab', async () => {
    render(Basic, { props: { lazyMount: true, unmountOnExit: true } })

    await expect.element(page.getByText('React Content')).not.toBeInTheDocument()

    await userEvent.click(page.getByText('React Trigger'))
    await expect.element(page.getByText('React Content')).toBeVisible()

    await userEvent.click(page.getByText('Solid Trigger'))
    await vi.waitFor(async () => await expect.element(page.getByText('React Content')).not.toBeInTheDocument())
  })
})
