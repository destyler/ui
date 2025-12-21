import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import { getExports, getParts } from '../../../../../../utils/test'
import Basic from '../examples/Basic.vue'
import Context from '../examples/Context.vue'
import RootProvider from '../examples/RootProvider.vue'
import { Breadcrumbs, breadcrumbsAnatomy } from '../index'

describe('[breadcrumbs] component', () => {
  it.each(getParts(breadcrumbsAnatomy))('should render part %s', async (part) => {
    render(Basic)
    expect(document.querySelector(part)).toBeInTheDocument()
  })

  it.each(getExports(breadcrumbsAnatomy))('should export %s', async (part) => {
    expect(Breadcrumbs[part]).toBeDefined()
  })

  describe('basic example', () => {
    it('should render all breadcrumb items', async () => {
      const screen = render(Basic)
      await expect.element(screen.getByText('Home')).toBeVisible()
      await expect.element(screen.getByText('Products')).toBeVisible()
      await expect.element(screen.getByText('Electronics')).toBeVisible()
      await expect.element(screen.getByText('Smartphones')).toBeVisible()
    })

    it('should render separators for items with href', async () => {
      const screen = render(Basic)
      const separators = screen.container.querySelectorAll('[data-part="separator"]')
      expect(separators.length).toBe(3)
    })

    it('should not render separator for last item without href', async () => {
      const screen = render(Basic)
      const smartphones = screen.getByText('Smartphones')
      const listItem = smartphones.element().closest('[data-part="item"]')
      expect(listItem?.querySelector('[data-part="separator"]')).toBeNull()
    })

    it('should render links with correct href', async () => {
      const screen = render(Basic)
      const homeLink = screen.getByText('Home').element()
      expect(homeLink).toHaveAttribute('href', '/')
    })
  })

  describe('rootProvider example', () => {
    it('should render breadcrumb items', async () => {
      const screen = render(RootProvider)
      await expect.element(screen.getByText('Home')).toBeVisible()
      await expect.element(screen.getByText('Products')).toBeVisible()
      await expect.element(screen.getByText('Electronics')).toBeVisible()
    })

    it('should render add item button', async () => {
      const screen = render(RootProvider)
      await expect.element(screen.getByText('Add Item')).toBeVisible()
    })
  })

  describe('context example', () => {
    it('should render breadcrumb items with custom icons', async () => {
      const screen = render(Context)
      await expect.element(screen.getByText('Dashboard')).toBeVisible()
      await expect.element(screen.getByText('Settings')).toBeVisible()
      await expect.element(screen.getByText('Profile')).toBeVisible()
    })

    it('should display hovered and focused state', async () => {
      const screen = render(Context)
      await expect.element(screen.getByText('Hovered: none')).toBeVisible()
      await expect.element(screen.getByText('Focused: none')).toBeVisible()
    })

    it('should render custom SVG separators', async () => {
      const screen = render(Context)
      const separators = screen.container.querySelectorAll('[data-part="separator"] svg')
      expect(separators.length).toBe(2)
    })
  })
})
