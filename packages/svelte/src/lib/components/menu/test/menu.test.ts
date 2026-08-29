import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-svelte'
import { page, userEvent } from 'vitest/browser'
import Basic from '../examples/Basic.svelte'
import Checkbox from '../examples/Checkbox.svelte'
import Context from '../examples/Context.svelte'
import Controlled from '../examples/Controlled.svelte'
import Group from '../examples/Group.svelte'
import Nested from '../examples/Nested.svelte'
import RadioGroup from '../examples/RadioGroup.svelte'
import { Menu, menuAnatomy } from '../index'

const componentExports = Menu as unknown as Record<string, unknown>
const partName = (part: string) => part.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)

describe('[menu] component', () => {
  it.each(menuAnatomy.keys())('renders and exports the %s anatomy part', async (part) => {
    const screen = await render(Basic)
    if (partName(part) === 'trigger-item')
      await userEvent.click(screen.getByRole('button', { name: 'Open menu' }))
    expect(screen.container.querySelector(`[data-scope="menu"][data-part="${partName(part)}"]`)).toBeInTheDocument()
    const exportName = `${part.charAt(0).toUpperCase()}${part.slice(1)}`
    expect(componentExports[exportName], `Menu.${exportName}`).toBeDefined()
  })

  it('opens, closes outside, and closes with Escape', async () => {
    await render(Basic)
    const trigger = page.getByRole('button', { name: 'Open menu' })
    const positioner = page.getByTestId('positioner')
    await expect.element(positioner).not.toBeVisible()
    await userEvent.click(trigger)
    await expect.element(positioner).toBeVisible()
    await userEvent.click(document.body)
    await vi.waitFor(async () => expect.element(positioner).not.toBeVisible())
    await userEvent.click(trigger)
    await userEvent.keyboard('{Escape}')
    await vi.waitFor(async () => expect.element(positioner).not.toBeVisible())
  })

  it('supports controlled state', async () => {
    await render(Controlled)
    const externalTrigger = page.getByRole('button', { name: 'Trigger from the outside' })
    await userEvent.click(externalTrigger)
    await expect.element(page.getByText('React')).toBeVisible()
    await userEvent.click(externalTrigger)
    await vi.waitFor(async () => expect.element(page.getByText('React')).not.toBeVisible())
  })

  it('marks disabled items and renders separators and arrows', async () => {
    await render(Basic)
    await userEvent.click(page.getByRole('button', { name: 'Open menu' }))
    await expect.element(page.getByText('Dialog')).toHaveAttribute('data-disabled', '')
    expect(document.querySelector('[data-part="separator"]')).toBeInTheDocument()
    expect(document.querySelector('[data-part="arrow"]')).toBeInTheDocument()
    expect(document.querySelector('[data-part="arrow-tip"]')).toBeInTheDocument()
  })

  it('supports checkbox items', async () => {
    await render(Checkbox)
    await userEvent.click(page.getByRole('button', { name: 'Open menu' }))
    const checkbox = page.getByText('Check me')
    const indicator = page.getByText('✅')
    await expect.element(indicator).toBeVisible()
    await userEvent.click(checkbox)
    await vi.waitFor(async () => expect.element(indicator).not.toBeVisible())
  })

  it('supports radio group items', async () => {
    await render(RadioGroup)
    await userEvent.click(page.getByRole('button', { name: 'Open menu' }))
    const react = page.getByRole('menuitemradio', { name: 'React' })
    const vue = page.getByRole('menuitemradio', { name: 'Vue' })
    await expect.element(react).toHaveAttribute('aria-checked', 'true')
    await userEvent.click(page.getByText('Vue'))
    await userEvent.click(page.getByRole('button', { name: 'Open menu' }))
    await vi.waitFor(async () => expect.element(vue).toHaveAttribute('aria-checked', 'true'))
  })

  it('renders groups and closes after item selection', async () => {
    await render(Group)
    await userEvent.click(page.getByRole('button', { name: 'Open menu' }))
    await expect.element(page.getByText('JS Frameworks')).toBeVisible()
    await expect.element(page.getByText('CSS Frameworks')).toBeVisible()
    await expect.element(page.getByText('UnoCSS')).toBeVisible()
    await userEvent.click(page.getByText('React'))
    await vi.waitFor(async () => expect.element(page.getByText('React')).not.toBeVisible())
  })

  it('opens nested menus', async () => {
    await render(Nested)
    await userEvent.click(page.getByRole('button', { name: 'Open menu' }))
    await userEvent.click(page.getByText('JS Frameworks'))
    await vi.waitFor(async () => expect.element(page.getByText('React')).toBeVisible())
  })

  it('opens a context menu on right click', async () => {
    await render(Context)
    await page.getByText('Right click me').click({ button: 'right' })
    await vi.waitFor(async () => expect.element(page.getByText('React')).toBeVisible())
  })

  it('supports keyboard navigation', async () => {
    await render(Group)
    await userEvent.click(page.getByRole('button', { name: 'Open menu' }))
    await userEvent.keyboard('{ArrowDown}')
    await vi.waitFor(() => {
      const item = document.querySelector('[data-part="item"][data-highlighted]')
      expect(item).toHaveTextContent('React')
    })
  })
})
