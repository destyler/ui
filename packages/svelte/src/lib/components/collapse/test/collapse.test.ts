import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-svelte'
import { page, userEvent } from 'vitest/browser'
import Basic from '../examples/Basic.svelte'
import Controlled from '../examples/Controlled.svelte'
import { Collapse, collapseAnatomy } from '../index'
import KeyboardFixture from './KeyboardFixture.svelte'

const componentExports = Collapse as unknown as Record<string, unknown>
const partName = (part: string) => part.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)

describe('[collapse] component', () => {
  it.each(collapseAnatomy.keys())('renders and exports the %s anatomy part', async (part) => {
    await render(Basic)
    expect(document.querySelector(`[data-scope="collapse"][data-part="${partName(part)}"]`)).toBeInTheDocument()
    const exportName = `${part.charAt(0).toUpperCase()}${part.slice(1)}`
    expect(componentExports[exportName], `Collapse.${exportName}`).toBeDefined()
  })

  it('has no expanded item by default and opens defaultValue', async () => {
    const screen = await render(Basic)
    await expect.element(screen.getByRole('button', { name: 'React Trigger' })).toHaveAttribute('aria-expanded', 'false')
    screen.unmount()
    await render(Basic, { props: { defaultValue: ['Solid'] } })
    await expect.element(page.getByRole('button', { name: 'Solid Trigger' })).toHaveAttribute('aria-expanded', 'true')
  })

  it('matches the controlled example status structure', async () => {
    const screen = await render(Controlled)
    const status = screen.getByText('Vue', { exact: true }).element() as HTMLElement
    expect(status.tagName).toBe('DIV')
    expect(status).toBe(screen.container.firstElementChild)
  })

  it('collapses an expanded item when collapsible is true', async () => {
    await render(Basic, { props: { collapsible: true } })
    const trigger = page.getByRole('button', { name: 'React Trigger' })
    await userEvent.click(trigger)
    await expect.element(trigger).toHaveAttribute('aria-expanded', 'true')
    await userEvent.click(trigger)
    await expect.element(trigger).toHaveAttribute('aria-expanded', 'false')
  })

  it('disables one item and all items through disabled', async () => {
    const screen = await render(Basic)
    await expect.element(screen.getByRole('button', { name: 'Svelte Trigger' })).toBeDisabled()
    screen.unmount()
    await render(Basic, { props: { disabled: true } })
    for (const name of ['React Trigger', 'Solid Trigger', 'Svelte Trigger', 'Vue Trigger'])
      await expect.element(page.getByRole('button', { name })).toBeDisabled()
  })

  it('allows multiple items and calls onValueChange', async () => {
    const onValueChange = vi.fn()
    await render(Basic, { props: { multiple: true, onValueChange } })
    const react = page.getByRole('button', { name: 'React Trigger' })
    const vue = page.getByRole('button', { name: 'Vue Trigger' })
    await userEvent.click(react)
    await userEvent.click(vue)
    await expect.element(react).toHaveAttribute('aria-expanded', 'true')
    await expect.element(vue).toHaveAttribute('aria-expanded', 'true')
    expect(onValueChange).toHaveBeenCalled()
  })

  it('moves focus with arrow, Home, and End keys while skipping disabled items', async () => {
    await render(Basic)
    const first = page.getByRole('button', { name: 'React Trigger' })
    const second = page.getByRole('button', { name: 'Solid Trigger' })
    const last = page.getByRole('button', { name: 'Vue Trigger' })
    await userEvent.click(first)
    await userEvent.keyboard('[ArrowDown]')
    await expect.element(second).toHaveFocus()
    await userEvent.keyboard('[ArrowDown]')
    await expect.element(last).toHaveFocus()
    await userEvent.keyboard('[Home]')
    await expect.element(first).toHaveFocus()
    await userEvent.keyboard('[End]')
    await expect.element(last).toHaveFocus()
  })

  it('reverses horizontal arrow navigation in RTL', async () => {
    await render(KeyboardFixture)
    const first = page.getByRole('button', { name: 'React Trigger' })
    const second = page.getByRole('button', { name: 'Solid Trigger' })

    await expect.element(first).toHaveAttribute('dir', 'rtl')
    await userEvent.click(first)
    await userEvent.keyboard('[ArrowLeft]')
    await expect.element(second).toHaveFocus()
    await userEvent.keyboard('[ArrowRight]')
    await expect.element(first).toHaveFocus()
  })

  it('lets Tab move focus out after the last trigger', async () => {
    await render(KeyboardFixture)
    const last = page.getByRole('button', { name: 'Vue Trigger' })
    const after = page.getByRole('button', { name: 'After collapse' })

    await userEvent.click(last)
    await userEvent.keyboard('[Tab]')
    await expect.element(after).toHaveFocus()
  })

  it('keeps the current item open when collapsible is false', async () => {
    await render(Basic, { props: { collapsible: false } })
    const trigger = page.getByRole('button', { name: 'React Trigger' })
    await userEvent.click(trigger)
    await userEvent.click(trigger)
    await expect.element(trigger).toHaveAttribute('aria-expanded', 'true')
  })

  it('lazy mounts without aria-controls until open', async () => {
    await render(Basic, { props: { lazyMount: true, collapsible: true } })
    const trigger = page.getByRole('button', { name: 'React Trigger' })
    const content = page.getByText('React Content')
    await expect.element(trigger).not.toHaveAttribute('aria-controls')
    await expect.element(content).not.toBeInTheDocument()
    await userEvent.click(trigger)
    await expect.element(trigger).toHaveAttribute('aria-controls')
    await expect.element(content).toBeVisible()
    await userEvent.click(trigger)
    await vi.waitFor(async () => expect.element(content).not.toBeVisible())
  })

  it('lazy mounts and unmounts on exit', async () => {
    await render(Basic, { props: { lazyMount: true, unmountOnExit: true, collapsible: true } })
    const trigger = page.getByRole('button', { name: 'React Trigger' })
    const content = page.getByText('React Content')
    await expect.element(content).not.toBeInTheDocument()
    await userEvent.click(trigger)
    await expect.element(content).toBeVisible()
    await userEvent.click(trigger)
    await vi.waitFor(async () => expect.element(content).not.toBeInTheDocument())
  })
})
