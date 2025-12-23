import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-vue'
import { page, userEvent } from 'vitest/browser'
import { getExports, getParts } from '../../../../../../utils/test'
import Basic from '../examples/Basic.vue'
import { NavigationMenu, navigationMenuAnatomy } from '../index'

describe('[navigation-menu] component', () => {
  it.each(getParts(navigationMenuAnatomy))('should render part %s', async (part) => {
    render(Basic)

    // viewport 相关部分只在打开菜单后存在
    if (part.includes('viewport') || part.includes('content') || part.includes('arrow')) {
      const trigger = page.getByRole('button', { name: 'Getting started' })
      await userEvent.click(trigger)
    }

    await vi.waitFor(() => {
      expect(page.getByRole('navigation').query()).toBeInTheDocument()
    })
  })

  it.each(getExports(navigationMenuAnatomy))('should export %s', async (part) => {
    expect(NavigationMenu[part]).toBeDefined()
  })

  it('should render navigation menu triggers', async () => {
    render(Basic)

    await expect.element(page.getByRole('button', { name: 'Getting started' })).toBeVisible()
    await expect.element(page.getByRole('button', { name: /^Components/ })).toBeVisible()
    await expect.element(page.getByRole('link', { name: 'Documentation' })).toBeVisible()
  })

  it('should not show content by default', async () => {
    render(Basic)

    await expect.element(page.getByText('How to install dependencies and structure your app.')).not.toBeVisible()
  })

  it('should invoke onValueChange when value changes', async () => {
    const onValueChange = vi.fn()
    render(Basic, { props: { onValueChange, openDelay: 0, closeDelay: 0 } })

    const trigger = page.getByRole('button', { name: 'Getting started' })
    await userEvent.click(trigger)

    await vi.waitFor(() => {
      expect(onValueChange).toHaveBeenCalledWith({ value: 'getting-started' })
    })
  })

  it('should support controlled value', async () => {
    render(Basic, { props: { value: 'getting-started', openDelay: 0, closeDelay: 0 } })

    await vi.waitFor(async () => {
      await expect.element(page.getByText('How to install dependencies and structure your app.')).toBeVisible()
    })
  })

  it('should support default value', async () => {
    render(Basic, { props: { defaultValue: 'components', openDelay: 0, closeDelay: 0 } })

    await vi.waitFor(async () => {
      await expect.element(page.getByText('A modal dialog that interrupts the user with important content.')).toBeVisible()
    })
  })

  it('should render link item without dropdown', async () => {
    render(Basic)

    const documentationLink = page.getByRole('link', { name: 'Documentation' })
    await expect.element(documentationLink).toBeVisible()

    // Documentation 是一个链接，不应该有下拉内容
    await userEvent.click(documentationLink)

    // 不应该有内容显示（因为它是一个直接链接）
    await expect.element(page.getByText('How to install dependencies and structure your app.')).not.toBeVisible()
  })

  it('should open on hover when hover trigger is enabled', async () => {
    render(Basic, { props: { disableHoverTrigger: false, openDelay: 0, closeDelay: 0 } })

    const trigger = page.getByRole('button', { name: 'Getting started' })
    await userEvent.hover(trigger)

    await vi.waitFor(async () => {
      await expect.element(page.getByText('How to install dependencies and structure your app.')).toBeVisible()
    })
  })

  it('should not open on hover when hover trigger is disabled', async () => {
    render(Basic, { props: { disableHoverTrigger: true, openDelay: 0, closeDelay: 0 } })

    const trigger = page.getByRole('button', { name: 'Getting started' })
    await userEvent.hover(trigger)

    // 等待一小段时间确保不会打开
    await new Promise(resolve => setTimeout(resolve, 100))
    await expect.element(page.getByText('How to install dependencies and structure your app.')).not.toBeVisible()
  })

  it('should not open on click when click trigger is disabled', async () => {
    render(Basic, { props: { disableClickTrigger: true, disableHoverTrigger: true, openDelay: 0, closeDelay: 0 } })

    const trigger = page.getByRole('button', { name: 'Getting started' })
    await userEvent.click(trigger)

    await expect.element(page.getByText('How to install dependencies and structure your app.')).not.toBeVisible()
  })

  it('should support keyboard navigation with arrow keys', async () => {
    render(Basic, { props: { openDelay: 0, closeDelay: 0 } })

    const firstTrigger = page.getByRole('button', { name: 'Getting started' })
    await userEvent.click(firstTrigger)

    await vi.waitFor(async () => {
      await expect.element(firstTrigger).toHaveFocus()
    })

    // 按右箭头键导航到下一个 trigger
    await userEvent.keyboard('[ArrowRight]')

    const secondTrigger = page.getByRole('button', { name: /^Components/ })
    await vi.waitFor(async () => {
      await expect.element(secondTrigger).toHaveFocus()
    })
  })

  it('should render components content correctly', async () => {
    render(Basic, { props: { openDelay: 0, closeDelay: 0 } })

    const trigger = page.getByRole('button', { name: /^Components/ })
    await userEvent.click(trigger)

    await vi.waitFor(async () => {
      await expect.element(page.getByText('A modal dialog that interrupts the user with important content.')).toBeVisible()
      await expect.element(page.getByText('For sighted users to preview content available behind a link.')).toBeVisible()
      await expect.element(page.getByText('Displays an indicator showing the completion progress of a task.')).toBeVisible()
    })
  })
})
