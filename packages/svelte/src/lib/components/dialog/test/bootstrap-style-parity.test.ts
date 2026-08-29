import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-svelte'
import { page, userEvent } from 'vitest/browser'
import CollapseBasic from '../../collapse/examples/Basic.svelte'
import CollapsibleBasic from '../../collapsible/examples/Basic.svelte'
import PopoverBasic from '../../popover/examples/Basic.svelte'
import SplitterBasic from '../../splitter/examples/Basic.svelte'
import StepsBasic from '../../steps/examples/Basic.svelte'
import TabsBasic from '../../tabs/examples/Basic.svelte'
import ToastBasic from '../../toast/examples/Basic.svelte'
import TooltipBasic from '../../tooltip/examples/Basic.svelte'
import DialogBasic from '../examples/Basic.svelte'
import '../../../../../../../utils/bootstrap.css'

describe('[examples] shared visual styles', () => {
  it('styles Dialog content through its anatomy attributes', async () => {
    await render(DialogBasic)
    await userEvent.click(page.getByRole('button', { name: 'Open Dialog' }))
    const content = document.querySelector('[data-scope="dialog"][data-part="content"]') as HTMLElement
    await vi.waitFor(() => expect(getComputedStyle(content).backgroundColor).toBe('rgb(255, 255, 255)'))
    expect(getComputedStyle(content).maxWidth).toBe('450px')
    expect(getComputedStyle(content).borderRadius).toBe('6px')
  })

  it('styles Popover and Tooltip floating content', async () => {
    const popover = await render(PopoverBasic)
    await userEvent.click(popover.getByRole('button', { name: 'click me' }))
    const popoverContent = document.querySelector('[data-scope="popover"][data-part="content"]') as HTMLElement
    await vi.waitFor(() => expect(getComputedStyle(popoverContent).minWidth).toBe('240px'))
    expect(getComputedStyle(popoverContent).padding).toBe('16px')
    popover.unmount()

    await render(TooltipBasic)
    await userEvent.hover(page.getByText('hover me'))
    const tooltipContent = document.querySelector('[data-scope="tooltip"][data-part="content"]') as HTMLElement
    await vi.waitFor(() => expect(getComputedStyle(tooltipContent).backgroundColor).toBe('rgb(0, 0, 0)'))
    expect(getComputedStyle(tooltipContent).color).toBe('rgb(255, 255, 255)')
  })

  it('styles Toast, Collapse, and Collapsible stateful content', async () => {
    const toast = await render(ToastBasic)
    await userEvent.click(toast.getByText('Create Toast'))
    const toastRoot = document.querySelector('[data-scope="toast"][data-part="root"]') as HTMLElement
    await vi.waitFor(() => expect(getComputedStyle(toastRoot).backgroundColor).toBe('rgb(0, 0, 255)'))
    expect(getComputedStyle(toastRoot).width).toBe('360px')
    toast.unmount()

    const collapse = await render(CollapseBasic)
    await userEvent.click(collapse.getByRole('button', { name: 'React Trigger' }))
    const collapseContent = collapse.container.querySelector('[data-part="item-content"]') as HTMLElement
    expect(getComputedStyle(collapseContent).backgroundColor).toBe('rgb(95, 158, 160)')
    collapse.unmount()

    const collapsible = await render(CollapsibleBasic)
    await userEvent.click(collapsible.getByRole('button', { name: 'Toggle' }))
    const collapsibleContent = collapsible.container.querySelector('[data-part="content"]') as HTMLElement
    expect(getComputedStyle(collapsibleContent).backgroundColor).toBe('rgb(95, 158, 160)')
  })

  it('styles Tabs, Splitter, and Steps layout anatomy', async () => {
    const tabs = await render(TabsBasic)
    const tabsRoot = tabs.container.querySelector('[data-scope="tabs"][data-part="root"]') as HTMLElement
    const tabsTrigger = tabs.container.querySelector('[data-part="trigger"]') as HTMLElement
    expect(getComputedStyle(tabsRoot).maxWidth).toBe('320px')
    expect(getComputedStyle(tabsTrigger).position).toBe('relative')
    tabs.unmount()

    const splitter = await render(SplitterBasic)
    const splitterRoot = splitter.container.querySelector('[data-scope="splitter"][data-part="root"]') as HTMLElement
    const splitterPanel = splitter.container.querySelector('[data-part="panel"]') as HTMLElement
    expect(getComputedStyle(splitterRoot).gap).toBe('4px')
    expect(getComputedStyle(splitterPanel).display).toBe('flex')
    splitter.unmount()

    const steps = await render(StepsBasic)
    const stepsRoot = steps.container.querySelector('[data-scope="steps"][data-part="root"]') as HTMLElement
    expect(getComputedStyle(stepsRoot).display).toBe('flex')
    expect(getComputedStyle(stepsRoot).maxWidth).toBe('400px')
  })
})
