import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { page, userEvent } from 'vitest/browser'
import { getExports, getParts } from '../../../../../../utils/test'
import { Basic } from '../examples/Basic'
import { NavigationMenu, navigationMenuAnatomy } from '../index'

const installationText = 'How to install dependencies and structure your app.'

describe('[navigation-menu] component', () => {
  it.each(getParts(navigationMenuAnatomy))('should render part %s', async (part) => {
    render(<Basic />)

    // viewport related parts only exist after opening menu
    if (part.includes('viewport') || part.includes('content') || part.includes('arrow')) {
      const trigger = page.getByRole('button', { name: 'Getting started' })
      await userEvent.click(trigger)
    }

    // itemIndicator is not used in Basic example, skip it
    if (part.includes('item-indicator')) {
      return
    }

    await vi.waitFor(() => {
      expect(document.querySelector(part)).toBeInTheDocument()
    })
  })

  it.each(getExports(navigationMenuAnatomy))('should export %s', (part) => {
    expect(NavigationMenu[part]).toBeDefined()
  })

  it('should render navigation menu triggers', async () => {
    const screen = await render(<Basic />)

    await expect.element(screen.getByRole('button', { name: 'Getting started' })).toBeVisible()
    await expect.element(screen.getByRole('button', { name: /^Components/ })).toBeVisible()
    await expect.element(screen.getByRole('link', { name: 'Documentation' })).toBeVisible()
  })

  it('should not show content by default', async () => {
    const screen = await render(<Basic />)

    await expect.element(screen.getByText(installationText)).not.toBeVisible()
  })

  it('should invoke onValueChange when value changes', async () => {
    const onValueChange = vi.fn()
    render(<Basic onValueChange={onValueChange} openDelay={0} closeDelay={0} />)

    const trigger = page.getByRole('button', { name: 'Getting started' })
    await userEvent.click(trigger)

    await vi.waitFor(() => {
      expect(onValueChange).toHaveBeenCalledWith({ value: 'getting-started' })
    })
  })

  it('should support default value', async () => {
    const screen = await render(<Basic defaultValue="components" openDelay={0} closeDelay={0} />)

    await vi.waitFor(() => {
      const componentsTrigger = screen.container.querySelector('[data-scope="navigation-menu"][data-part="trigger"][data-value="components"]')
      const componentsContent = screen.container.querySelector('[data-scope="navigation-menu"][data-part="content"][data-value="components"]')

      expect(componentsTrigger).toHaveAttribute('aria-expanded', 'true')
      expect(componentsContent).toHaveAttribute('data-state', 'open')
      expect(componentsContent).not.toHaveAttribute('hidden')
      expect(componentsContent).toHaveTextContent('A modal dialog that interrupts the user with important content.')
    })
  })

  it('should render link item without dropdown', async () => {
    const screen = await render(<Basic />)

    const documentationLink = screen.getByRole('link', { name: 'Documentation' })
    await expect.element(documentationLink).toBeVisible()
    await expect.element(documentationLink).toHaveAttribute('data-part', 'link')
    await expect.element(documentationLink).not.toHaveAttribute('aria-controls')
    await expect.element(documentationLink).not.toHaveAttribute('aria-expanded')

    expect(screen.container.querySelector('[data-scope="navigation-menu"][data-part="content"][data-value="docs"]')).not.toBeInTheDocument()
  })

  it('should open on hover when hover trigger is enabled', async () => {
    const screen = await render(<Basic disableHoverTrigger={false} openDelay={0} closeDelay={0} />)

    const trigger = screen.getByRole('button', { name: 'Getting started' })
    await userEvent.hover(trigger)

    await vi.waitFor(async () => {
      await expect.element(screen.getByText(installationText)).toBeVisible()
    })
  })

  it('should not open on hover when hover trigger is disabled', async () => {
    const screen = await render(<Basic disableHoverTrigger openDelay={0} closeDelay={0} />)

    const trigger = screen.getByRole('button', { name: 'Getting started' })
    await userEvent.hover(trigger)

    // Wait a bit to ensure it doesn't open
    await new Promise(resolve => setTimeout(resolve, 100))
    await expect.element(screen.getByText(installationText)).not.toBeVisible()
  })

  it('should not open on click when click trigger is disabled', async () => {
    const screen = await render(<Basic disableClickTrigger disableHoverTrigger openDelay={0} closeDelay={0} />)

    const trigger = screen.getByRole('button', { name: 'Getting started' })
    await userEvent.click(trigger)

    await expect.element(screen.getByText(installationText)).not.toBeVisible()
  })

  it('should support keyboard navigation with arrow keys', async () => {
    const screen = await render(<Basic openDelay={0} closeDelay={0} />)

    const firstTrigger = screen.getByRole('button', { name: 'Getting started' })
    await userEvent.click(firstTrigger)

    await vi.waitFor(async () => {
      await expect.element(firstTrigger).toHaveFocus()
    })

    // Press right arrow to navigate to next trigger
    await userEvent.keyboard('[ArrowRight]')

    const secondTrigger = screen.getByRole('button', { name: /^Components/ })
    await vi.waitFor(async () => {
      await expect.element(secondTrigger).toHaveFocus()
    })
  })

  it('should render components content correctly', async () => {
    const screen = await render(<Basic openDelay={0} closeDelay={0} />)

    const trigger = screen.getByRole('button', { name: /^Components/ })
    await userEvent.click(trigger)

    await vi.waitFor(async () => {
      await expect.element(screen.getByText('A modal dialog that interrupts the user with important content.')).toBeVisible()
      await expect.element(screen.getByText('For sighted users to preview content available behind a link.')).toBeVisible()
      await expect.element(screen.getByText('Displays an indicator showing the completion progress of a task.')).toBeVisible()
    })
  })
})
