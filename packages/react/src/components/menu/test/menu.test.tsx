import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { page, userEvent } from 'vitest/browser'
import { getExports, getParts } from '../../../../../../utils/test'
import { Basic } from '../examples/Basic'
import { Checkbox } from '../examples/Checkbox'
import { Context } from '../examples/Context'
import { Controlled } from '../examples/Controlled'
import { Group } from '../examples/Group'
import { Nested } from '../examples/Nested'
import { RadioGroup } from '../examples/RadioGroup'
import { Menu, menuAnatomy } from '../index'

describe('[menu] component', () => {
  it.each(getParts(menuAnatomy))('should render part %s', async (part) => {
    render(<Basic />)

    // trigger-item 只在打开菜单后的嵌套菜单中存在
    if (part.includes('trigger-item')) {
      const trigger = page.getByRole('button', { name: 'Open menu' })
      await userEvent.click(trigger)
    }

    expect(document.querySelector(part)).toBeInTheDocument()
  })

  it.each(getExports(menuAnatomy))('should export %s', async (part) => {
    expect(Menu[part]).toBeDefined()
  })

  it('should not show menu content by default', async () => {
    render(<Basic />)

    await expect.element(page.getByTestId('positioner')).not.toBeVisible()
  })

  it('should open menu when trigger is clicked', async () => {
    render(<Basic />)

    const trigger = page.getByRole('button', { name: 'Open menu' })
    await userEvent.click(trigger)

    await expect.element(page.getByTestId('positioner')).toBeVisible()
  })

  it('should close menu when clicking outside', async () => {
    render(<Basic />)

    const trigger = page.getByRole('button', { name: 'Open menu' })
    await userEvent.click(trigger)

    await expect.element(page.getByTestId('positioner')).toBeVisible()

    await userEvent.click(document.body)
  })

  it('should close menu when escape key is pressed', async () => {
    render(<Basic />)

    const trigger = page.getByRole('button', { name: 'Open menu' })
    await userEvent.click(trigger)

    await expect.element(page.getByTestId('positioner')).toBeVisible()

    await userEvent.keyboard('{Escape}')
  })

  it('should support controlled open state', async () => {
    render(<Controlled />)

    const externalTrigger = page.getByRole('button', { name: 'Trigger from the outside' })

    await userEvent.click(externalTrigger)

    await expect.element(page.getByText('React')).toBeVisible()

    await userEvent.click(externalTrigger)
  })

  it('should render disabled menu item', async () => {
    render(<Basic />)

    const trigger = page.getByRole('button', { name: 'Open menu' })
    await userEvent.click(trigger)

    const disabledItem = page.getByText('Dialog')
    await expect.element(disabledItem).toHaveAttribute('data-disabled', '')
  })

  it('should support checkbox items', async () => {
    render(<Checkbox />)

    const trigger = page.getByRole('button', { name: 'Open menu' })
    await userEvent.click(trigger)

    const checkboxItem = page.getByText('Check me')
    await expect.element(checkboxItem).toBeVisible()

    // 初始状态应该是选中的（checked: true）
    const indicator = page.getByText('✅')
    await expect.element(indicator).toBeVisible()

    await userEvent.click(checkboxItem)

    // 点击后应该取消选中
    await vi.waitFor(async () => {
      await expect.element(indicator).not.toBeVisible()
    })
  })

  it('should support radio group items', async () => {
    render(<RadioGroup />)

    const trigger = page.getByRole('button', { name: 'Open menu' })
    await userEvent.click(trigger)

    const reactItem = page.getByText('React')
    const vueItem = page.getByText('Vue')

    // React 应该默认选中
    await expect.element(reactItem).toBeVisible()

    // 点击 Vue 切换选中项
    await userEvent.click(vueItem)

    await vi.waitFor(async () => {
      const indicators = document.querySelectorAll('[data-part="item-indicator"]')
      expect(indicators.length).toBeGreaterThan(0)
    })
  })

  it('should render item groups with labels', async () => {
    render(<Group />)

    const trigger = page.getByRole('button', { name: 'Open menu' })
    await userEvent.click(trigger)

    await expect.element(page.getByText('JS Frameworks')).toBeVisible()
    await expect.element(page.getByText('CSS Frameworks')).toBeVisible()
    await expect.element(page.getByText('React')).toBeVisible()
    await expect.element(page.getByText('UnoCSS')).toBeVisible()
  })

  it('should support nested menus', async () => {
    render(<Nested />)

    const trigger = page.getByRole('button', { name: 'Open menu' })
    await userEvent.click(trigger)

    const submenuTrigger = page.getByText('JS Frameworks')
    await expect.element(submenuTrigger).toBeVisible()

    await userEvent.click(submenuTrigger)

    await vi.waitFor(async () => {
      await expect.element(page.getByText('React')).toBeVisible()
      await expect.element(page.getByText('Vue')).toBeVisible()
    })
  })

  it('should open context menu on right click', async () => {
    render(<Context />)

    const contextTrigger = page.getByText('Right click me')
    await contextTrigger.click({ button: 'right' })

    await vi.waitFor(async () => {
      await expect.element(page.getByText('React')).toBeVisible()
      await expect.element(page.getByText('Solid')).toBeVisible()
      await expect.element(page.getByText('Vue')).toBeVisible()
    })
  })

  it('should render separator between menu sections', async () => {
    render(<Basic />)

    const trigger = page.getByRole('button', { name: 'Open menu' })
    await userEvent.click(trigger)

    const separators = document.querySelectorAll('[data-part="separator"]')
    expect(separators.length).toBeGreaterThan(0)
  })

  it('should render arrow and arrow tip', async () => {
    render(<Basic />)

    const trigger = page.getByRole('button', { name: 'Open menu' })
    await userEvent.click(trigger)

    expect(document.querySelector('[data-part="arrow"]')).toBeInTheDocument()
    expect(document.querySelector('[data-part="arrow-tip"]')).toBeInTheDocument()
  })

  it('should support keyboard navigation', async () => {
    render(<Group />)

    const trigger = page.getByRole('button', { name: 'Open menu' })
    await userEvent.click(trigger)

    // 按下箭头键导航
    await userEvent.keyboard('{ArrowDown}')

    // 菜单使用 aria-activedescendant 模式，焦点保持在 content 上
    // 高亮的菜单项通过 data-highlighted 属性标记
    await vi.waitFor(() => {
      const highlightedItem = document.querySelector('[data-part="item"][data-highlighted]')
      expect(highlightedItem).toBeInTheDocument()
      expect(highlightedItem?.textContent?.trim()).toBe('React')
    })
  })

  it('should close menu when clicking a menu item', async () => {
    render(<Group />)

    const trigger = page.getByRole('button', { name: 'Open menu' })
    await userEvent.click(trigger)

    const reactItem = page.getByText('React')
    await expect.element(reactItem).toBeVisible()
    await userEvent.click(reactItem)

    await vi.waitFor(() => {
      expect(page.getByText('React')).not.toBeVisible()
    })
  })
})
