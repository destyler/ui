import { render, screen, waitFor } from '@solidjs/testing-library'
import user from '@testing-library/user-event'
import { Breadcrumbs, breadcrumbsAnatomy } from '../'
import { getExports, getParts } from '../../../setup-test'
import { Basic } from '../examples/Basic'
import { Context } from '../examples/Context'
import { RootProvider } from '../examples/RootProvider'

describe('breadcrumbs', () => {
  it.each(getParts(breadcrumbsAnatomy))('should render part %s', (part) => {
    render(() => <Basic />)
    expect(document.querySelector(part)).toBeInTheDocument()
  })

  it.each(getExports(breadcrumbsAnatomy))('should export %s', (part) => {
    expect(Breadcrumbs[part]).toBeDefined()
  })

  it('should render items, links, and separators', () => {
    render(() => <Basic />)

    for (const label of ['Home', 'Products', 'Electronics', 'Smartphones']) {
      expect(screen.getByText(label)).toBeVisible()
    }
    expect(document.querySelectorAll('[data-scope="breadcrumbs"][data-part="separator"]')).toHaveLength(3)
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/')

    const currentItem = screen.getByText('Smartphones').closest('[data-part="item"]')
    expect(currentItem?.querySelector('[data-part="separator"]')).toBeNull()
  })

  it('should react to dynamic items through RootProvider', async () => {
    render(() => <RootProvider />)
    await user.click(screen.getByRole('button', { name: 'Add Item' }))

    await waitFor(() => expect(screen.getByText('Item 4')).toBeVisible())
    expect(document.querySelectorAll('[data-scope="breadcrumbs"][data-part="item"]')).toHaveLength(4)
  })

  it('should expose hover and focus state through Context', async () => {
    render(() => <Context />)
    const settings = screen.getByRole('link', { name: 'Settings' })

    expect(screen.getByText('Hovered: none')).toBeVisible()
    await user.hover(settings)
    await waitFor(() => expect(screen.getByText('Hovered: 2')).toBeVisible())

    settings.focus()
    await waitFor(() => expect(screen.getByText('Focused: 2')).toBeVisible())
    expect(document.querySelectorAll('[data-part="separator"] svg')).toHaveLength(2)

    settings.blur()
    await user.unhover(settings)
  })
})
