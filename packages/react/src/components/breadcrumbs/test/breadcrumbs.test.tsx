import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { page, userEvent } from 'vitest/browser'
import { getExports, getParts } from '../../../../../../utils/test'
import { Basic } from '../examples/Basic'
import { Context } from '../examples/Context'
import { RootProvider } from '../examples/RootProvider'
import { Breadcrumbs, breadcrumbsAnatomy } from '../index'

describe('[breadcrumbs] component', () => {
  it.each(getParts(breadcrumbsAnatomy))('should render part %s', async (part) => {
    render(<Basic />)
    expect(document.querySelector(part)).toBeInTheDocument()
  })

  it.each(getExports(breadcrumbsAnatomy))('should export %s', async (part) => {
    expect(Breadcrumbs).toHaveProperty(part, expect.anything())
  })

  describe('basic example', () => {
    it('should render all breadcrumb items', async () => {
      render(<Basic />)
      await expect.element(page.getByText('Home')).toBeVisible()
      await expect.element(page.getByText('Products')).toBeVisible()
      await expect.element(page.getByText('Electronics')).toBeVisible()
      await expect.element(page.getByText('Smartphones')).toBeVisible()
    })

    it('should render separators for items with href', async () => {
      render(<Basic />)
      const separators = document.querySelectorAll('[data-part="separator"]')
      expect(separators.length).toBe(3)
    })

    it('should not render separator for last item without href', async () => {
      render(<Basic />)
      const smartphones = page.getByText('Smartphones')
      const listItem = smartphones.element().closest('[data-part="item"]')
      expect(listItem?.querySelector('[data-part="separator"]')).toBeNull()
    })

    it('should render links', async () => {
      render(<Basic />)
      await expect.element(page.getByRole('link', { name: 'Home' })).toBeVisible()
      await expect.element(page.getByRole('link', { name: 'Products' })).toBeVisible()
      await expect.element(page.getByRole('link', { name: 'Electronics' })).toBeVisible()
    })

    it('preserves destination, current-page, and item-label semantics', async () => {
      render(<Basic />)
      const home = page.getByRole('link', { name: 'Home' })
      const current = page.getByRole('link', { name: 'Smartphones' })
      await expect.element(home).toHaveAttribute('href', '/')
      await expect.element(home).not.toHaveAttribute('aria-current')
      await expect.element(page.getByRole('link', { name: 'Products' })).toHaveAttribute('href', '/products')
      await expect.element(current).not.toHaveAttribute('href')
      await expect.element(current).toHaveAttribute('aria-current', 'page')
      await expect.element(current).toHaveAttribute('tabindex', '0')
      await expect.element(page.getByRole('listitem', { name: 'breadcrumbs:listitem:Home' })).toBeVisible()
    })
  })

  describe('rootProvider example', () => {
    it('should render breadcrumb items', async () => {
      render(<RootProvider />)
      await expect.element(page.getByText('Home')).toBeVisible()
      await expect.element(page.getByText('Products')).toBeVisible()
      await expect.element(page.getByText('Electronics')).toBeVisible()
    })

    it('should render add item button', async () => {
      render(<RootProvider />)
      await expect.element(page.getByText('Add Item')).toBeVisible()
    })
  })

  describe('context example', () => {
    it('should render breadcrumb items with custom icons', async () => {
      render(<Context />)
      await expect.element(page.getByText('Dashboard')).toBeVisible()
      await expect.element(page.getByText('Settings')).toBeVisible()
      await expect.element(page.getByText('Profile')).toBeVisible()
    })

    it('should display hovered and focused state', async () => {
      render(<Context />)
      await expect.element(page.getByText('Hovered: none')).toBeVisible()
      await expect.element(page.getByText('Focused: none')).toBeVisible()

      const settings = page.getByRole('link', { name: 'Settings' })
      await userEvent.hover(settings)
      await expect.element(settings).toHaveAttribute('data-hover', 'true')
      await expect.element(page.getByText('Hovered: 2')).toBeVisible()
      await userEvent.unhover(settings)
      await expect.element(page.getByText('Hovered: none')).toBeVisible()

      await userEvent.tab()
      await expect.element(page.getByText('Focused: 1')).toBeVisible()
      await userEvent.tab()
      await expect.element(settings).toHaveAttribute('data-focus', 'true')
      await expect.element(page.getByText('Focused: 2')).toBeVisible()
    })

    it('should render custom SVG separators', async () => {
      render(<Context />)
      const separators = document.querySelectorAll('[data-part="separator"] svg')
      expect(separators.length).toBe(2)
    })
  })
})
