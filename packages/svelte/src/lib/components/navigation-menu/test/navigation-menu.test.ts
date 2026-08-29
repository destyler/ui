import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-svelte'
import { page, userEvent } from 'vitest/browser'
import Basic from '../examples/Basic.svelte'
import Controlled from '../examples/Controlled.svelte'
import RootProvider from '../examples/RootProvider.svelte'
import { NavigationMenu, navigationMenuAnatomy } from '../index'

const componentExports = NavigationMenu as unknown as Record<string, unknown>
const partName = (part: string) => part.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)
const installationText = 'How to install dependencies and structure your app.'

describe('[navigation-menu] component', () => {
  it.each(navigationMenuAnatomy.keys())('renders and exports the %s anatomy part', async (part) => {
    const screen = await render(Basic, { props: { openDelay: 0, closeDelay: 0 } })
    const dataPart = partName(part)
    if (['viewport', 'viewport-positioner', 'content', 'arrow'].includes(dataPart))
      await userEvent.click(screen.getByRole('button', { name: 'Getting started' }))
    if (dataPart !== 'item-indicator')
      await vi.waitFor(() => expect(screen.container.querySelector(`[data-scope="navigation-menu"][data-part="${dataPart}"]`)).toBeInTheDocument())
    const exportName = `${part.charAt(0).toUpperCase()}${part.slice(1)}`
    expect(componentExports[exportName], `NavigationMenu.${exportName}`).toBeDefined()
  })

  it('renders triggers and a direct link while content starts hidden', async () => {
    const screen = await render(Basic)
    expect(screen.container.querySelector(':scope > main')).toBeInTheDocument()
    await expect.element(page.getByRole('button', { name: 'Getting started' })).toBeVisible()
    await expect.element(page.getByRole('button', { name: /^Components/ })).toBeVisible()
    const docs = page.getByRole('link', { name: 'Documentation' })
    await expect.element(docs).toBeVisible()
    await expect.element(docs).not.toHaveAttribute('aria-controls')
    await expect.element(page.getByText(installationText)).not.toBeVisible()
  })

  it('opens on click and reports value changes', async () => {
    const onValueChange = vi.fn()
    await render(Basic, { props: { onValueChange, disableHoverTrigger: true, openDelay: 0, closeDelay: 0 } })
    const trigger = page.getByRole('button', { name: 'Getting started' })
    await userEvent.click(trigger)
    await vi.waitFor(async () => expect.element(page.getByText(installationText)).toBeVisible())
    await expect.element(page.getByText('A modal dialog that interrupts the user with important content.')).not.toBeVisible()
    expect(onValueChange).toHaveBeenCalledWith({ value: 'getting-started' })
    await expect.element(trigger).toHaveAttribute('aria-expanded', 'true')
  })

  it('supports a default value', async () => {
    const screen = await render(Basic, { props: { defaultValue: 'components', openDelay: 0, closeDelay: 0 } })
    const trigger = screen.container.querySelector('[data-part="trigger"][data-value="components"]')
    const content = screen.container.querySelector('[data-part="content"][data-value="components"]')
    await vi.waitFor(() => {
      expect(trigger).toHaveAttribute('aria-expanded', 'true')
      expect(content).toHaveAttribute('data-state', 'open')
    })
  })

  it('respects hover and click trigger options', async () => {
    const hover = await render(Basic, { props: { disableHoverTrigger: false, openDelay: 0, closeDelay: 0 } })
    await userEvent.hover(hover.getByRole('button', { name: 'Getting started' }))
    await vi.waitFor(async () => expect.element(hover.getByText(installationText)).toBeVisible())
    hover.unmount()

    const disabled = await render(Basic, { props: { disableHoverTrigger: true, disableClickTrigger: true, openDelay: 0, closeDelay: 0 } })
    const trigger = disabled.getByRole('button', { name: 'Getting started' })
    await userEvent.hover(trigger)
    await userEvent.click(trigger)
    await new Promise(resolve => setTimeout(resolve, 50))
    await expect.element(disabled.getByText(installationText)).not.toBeVisible()
  })

  it('supports arrow-key navigation', async () => {
    await render(Basic, { props: { openDelay: 0, closeDelay: 0 } })
    const first = page.getByRole('button', { name: 'Getting started' })
    const second = page.getByRole('button', { name: /^Components/ })
    await userEvent.click(first)
    await expect.element(first).toHaveFocus()
    await userEvent.keyboard('[ArrowRight]')
    await vi.waitFor(async () => expect.element(second).toHaveFocus())
  })

  it('changes content through controlled and RootProvider examples', async () => {
    const controlled = await render(Controlled)
    expect(controlled.container.querySelector(':scope > div')).toBeInTheDocument()
    await userEvent.click(controlled.getByRole('button', { name: 'Open Components' }))
    await expect.element(controlled.getByText('Current value: components')).toBeVisible()
    await expect.element(controlled.getByText('Dialog')).toBeVisible()
    controlled.unmount()

    const provider = await render(RootProvider)
    await expect.element(provider.getByText('Installation')).toBeVisible()
  })
})
