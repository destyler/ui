import type { Component } from 'svelte'
import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-svelte'
import { page, userEvent } from 'vitest/browser'
import Basic from '../examples/Basic.svelte'
import Controlled from '../examples/Controlled.svelte'
import DefaultOpen from '../examples/DefaultOpen.svelte'
import RootProvider from '../examples/RootProvider.svelte'
import WithContext from '../examples/WithContext.svelte'
import { FloatingPanel, floatingPanelAnatomy } from '../index'

const componentExports = FloatingPanel as unknown as Record<string, unknown>
const exceptions: string[] = []

describe('[floating-panel] component', () => {
  it.each(floatingPanelAnatomy.keys())('renders the %s anatomy part', async (part: string) => {
    const screen = await render(Basic)
    const dataPart = part.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)
    expect(screen.container.querySelector(`[data-scope="floating-panel"][data-part="${dataPart}"]`)).toBeInTheDocument()
  })

  it.each(floatingPanelAnatomy.keys())('exports the %s anatomy part', (part: string) => {
    const exportName = `${part.charAt(0).toUpperCase()}${part.slice(1)}`
    if (!exceptions.includes(exportName))
      expect(componentExports[exportName], `FloatingPanel.${exportName}`).toBeDefined()
  })

  it('opens the panel when the trigger is clicked', async () => {
    await render(Basic)
    await userEvent.click(page.getByText('Toggle Panel'))
    await vi.waitFor(async () => expect.element(page.getByText('Floating Panel')).toBeVisible())
  })

  it('closes a default-open panel from the close trigger', async () => {
    await render(DefaultOpen)
    await expect.element(page.getByText('Default Open Panel')).toBeVisible()
    await userEvent.click(page.getByRole('button', { name: 'Close' }))
    await vi.waitFor(async () => expect.element(page.getByText('Default Open Panel')).not.toBeVisible())
  })

  it('opens and closes the panel', async () => {
    await render(Basic)
    await userEvent.click(page.getByText('Toggle Panel'))
    await expect.element(page.getByText('Floating Panel')).toBeVisible()
    await userEvent.click(page.getByRole('button', { name: 'Close' }))
    await vi.waitFor(async () => expect.element(page.getByText('Floating Panel')).not.toBeVisible())
  })

  it('renders with the default open state', async () => {
    await render(DefaultOpen)
    await expect.element(page.getByText('Default Open Panel')).toBeVisible()
  })

  it('renders a button trigger', async () => {
    const screen = await render(Basic)
    const trigger = screen.container.querySelector('[data-scope="floating-panel"][data-part="trigger"]')
    expect(trigger).toBeInTheDocument()
    expect(trigger?.tagName.toLowerCase()).toBe('button')
  })

  it('renders all resize triggers', async () => {
    const screen = await render(DefaultOpen)
    expect(screen.container.querySelectorAll('[data-scope="floating-panel"][data-part="resize-trigger"]')).toHaveLength(8)
  })

  it.each(['header', 'title', 'body', 'drag-trigger'])('renders the %s structure', async (part) => {
    const screen = await render(DefaultOpen)
    expect(screen.container.querySelector(`[data-scope="floating-panel"][data-part="${part}"]`)).toBeInTheDocument()
  })

  it('renders all window control triggers', async () => {
    const screen = await render(DefaultOpen)
    for (const part of ['minimize-trigger', 'maximize-trigger', 'restore-trigger', 'close-trigger'])
      expect(screen.container.querySelector(`[data-scope="floating-panel"][data-part="${part}"]`)).toBeInTheDocument()
  })

  it.each([
    ['Basic', Basic],
    ['Controlled', Controlled],
    ['RootProvider', RootProvider],
    ['WithContext', WithContext],
  ] as const)('keeps the %s utility classes aligned with the React example', async (name, component) => {
    const screen = await render(component as Component<any>)
    const find = (part: string) => screen.container.querySelector(`[data-scope="floating-panel"][data-part="${part}"]`)

    expect(screen.container.querySelector('main')).toHaveClass('p-10')
    expect(find('trigger')?.getAttribute('class')).toBe('px-4 py-2 bg-blue-500 text-white rounded')
    expect(find('content')?.getAttribute('class')).toBe('bg-white border rounded-lg shadow-lg overflow-hidden')
    expect(find('drag-trigger')?.getAttribute('class')).toBe('cursor-move')
    expect(find('header')?.getAttribute('class')).toBe('flex items-center justify-between px-4 py-2 border-b bg-gray-50')
    expect(find('title')?.getAttribute('class')).toBe('text-sm font-medium')
    expect(find('body')?.getAttribute('class')).toBe('p-4 relative')
    if (name === 'Basic')
      expect(find('dock')?.getAttribute('class')).toBe('fixed bottom-4 left-1/2 -translate-x-1/2 bg-gray-100 border rounded-lg shadow-lg')

    const neutralControlClass = 'w-6 h-6 flex items-center justify-center hover:bg-gray-200 rounded'
    for (const part of ['minimize-trigger', 'maximize-trigger', 'restore-trigger'])
      expect(find(part)?.getAttribute('class')).toBe(neutralControlClass)
    expect(find('close-trigger')?.getAttribute('class')).toBe('w-6 h-6 flex items-center justify-center hover:bg-red-100 hover:text-red-500 rounded')

    const resizeClasses = {
      n: 'absolute top-0 left-1/2 -translate-x-1/2 w-4 h-1 cursor-n-resize',
      e: 'absolute right-0 top-1/2 -translate-y-1/2 w-1 h-4 cursor-e-resize',
      w: 'absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 cursor-w-resize',
      s: 'absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-1 cursor-s-resize',
      ne: 'absolute top-0 right-0 w-2 h-2 cursor-ne-resize',
      se: 'absolute bottom-0 right-0 w-2 h-2 cursor-se-resize',
      sw: 'absolute bottom-0 left-0 w-2 h-2 cursor-sw-resize',
      nw: 'absolute top-0 left-0 w-2 h-2 cursor-nw-resize',
    }
    for (const [axis, className] of Object.entries(resizeClasses)) {
      const resize = screen.container.querySelector(`[data-part="resize-trigger"][data-axis="${axis}"]`)
      expect(resize?.getAttribute('class')).toBe(className)
    }
  })

  it('keeps body copy in paragraph elements used by the shared styles', async () => {
    const basic = await render(Basic)
    expect(basic.container.querySelector('[data-part="body"] > p')).toHaveTextContent('Some content')
    basic.unmount()

    const defaultOpen = await render(DefaultOpen)
    expect(defaultOpen.container.querySelector('[data-part="body"] > p')).toHaveTextContent('This panel opens by default')
  })
})
