import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import { page, userEvent } from 'vitest/browser'
import Basic from '../examples/Basic.svelte'
import Context from '../examples/Context.svelte'
import RootProvider from '../examples/RootProvider.svelte'
import { Breadcrumbs, breadcrumbsAnatomy } from '../index'

const componentExports = Breadcrumbs as unknown as Record<string, unknown>
const partName = (part: string) => part.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)

describe('[breadcrumbs] component', () => {
  it.each(breadcrumbsAnatomy.keys())('renders and exports the %s anatomy part', async (part) => {
    const screen = await render(Basic)
    expect(screen.container.querySelector(`[data-scope="breadcrumbs"][data-part="${partName(part)}"]`)).toBeInTheDocument()
    const exportName = `${part.charAt(0).toUpperCase()}${part.slice(1)}`
    expect(componentExports[exportName], `Breadcrumbs.${exportName}`).toBeDefined()
  })

  it('renders items, links, and separators', async () => {
    await render(Basic)
    for (const label of ['Home', 'Products', 'Electronics', 'Smartphones'])
      await expect.element(page.getByText(label)).toBeVisible()

    expect(document.querySelectorAll('[data-scope="breadcrumbs"][data-part="separator"]')).toHaveLength(3)
    await expect.element(page.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/')
    const currentItem = page.getByText('Smartphones').element().closest('[data-part="item"]')
    expect(currentItem?.querySelector('[data-part="separator"]')).toBeNull()
  })

  it('reacts to dynamic items through RootProvider', async () => {
    const screen = await render(RootProvider)
    expect(screen.container.querySelector(':scope > main')).toBeInTheDocument()
    await userEvent.click(page.getByRole('button', { name: 'Add Item' }))
    await expect.element(page.getByText('Item 4')).toBeVisible()
    expect(document.querySelectorAll('[data-scope="breadcrumbs"][data-part="item"]')).toHaveLength(4)
  })

  it('exposes hover and focus state through Context', async () => {
    const screen = await render(Context)
    expect(screen.container.querySelector(':scope > main')).toBeInTheDocument()
    expect(screen.container.querySelector('[data-part="link"] > span')).toHaveTextContent('🏠')
    const settings = page.getByRole('link', { name: 'Settings' })
    await expect.element(page.getByText('Hovered: none')).toBeVisible()
    await userEvent.hover(settings)
    await expect.element(page.getByText('Hovered: 2')).toBeVisible()
    ;(settings.element() as HTMLElement).focus()
    await expect.element(page.getByText('Focused: 2')).toBeVisible()
    expect(document.querySelectorAll('[data-part="separator"] svg')).toHaveLength(2)
  })
})
