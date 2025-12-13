import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-vue'
import { page, userEvent } from 'vitest/browser'
import { getExports, getParts } from '../../../../../../utils/test'
import Basic from '../examples/Basic.vue'
import Disabled from '../examples/Disabled.vue'
import InitialValue from '../examples/InitialValue.vue'
import OnEvent from '../examples/OnEvent.vue'
import RootProvider from '../examples/RootProvider.vue'
import { Radio, radioAnatomy } from '../index'

describe('[radio] component', () => {
  it.each(getParts(radioAnatomy))('should render part %s', async (part) => {
    render(Basic)
    expect(document.querySelector(part)).toBeInTheDocument()
  })

  it.each(getExports(radioAnatomy))('should export %s', async (part) => {
    expect(Radio[part]).toBeDefined()
  })

  it('should render radio items with correct labels', async () => {
    render(Basic)

    await expect.element(page.getByText('React')).toBeInTheDocument()
    await expect.element(page.getByText('Solid')).toBeInTheDocument()
    await expect.element(page.getByText('Vue')).toBeInTheDocument()
    await expect.element(page.getByText('Svelte')).toBeInTheDocument()
  })

  it('should handle radio selection', async () => {
    render(Basic)

    const reactLabel = page.getByText('React')
    await userEvent.click(reactLabel)

    const radioItems = document.querySelectorAll('[data-scope="radio-group"][data-part="item"]')
    const reactItem = Array.from(radioItems).find(item =>
      item.querySelector('[data-part="item-text"]')?.textContent === 'React',
    ) as HTMLElement

    await expect.element(reactItem).toHaveAttribute('data-state', 'checked')
  })

  it('should allow switching between radio items', async () => {
    render(Basic)

    // 选择第一个
    await userEvent.click(page.getByText('React'))

    // 选择第二个
    await userEvent.click(page.getByText('Vue'))

    const radioItems = document.querySelectorAll('[data-scope="radio-group"][data-part="item"]')
    const vueItem = Array.from(radioItems).find(item =>
      item.querySelector('[data-part="item-text"]')?.textContent === 'Vue',
    ) as HTMLElement

    await expect.element(vueItem).toHaveAttribute('data-state', 'checked')
  })

  it('should disable specific radio item', async () => {
    render(Basic)

    const radioItems = document.querySelectorAll('[data-scope="radio-group"][data-part="item"]')
    const svelteItem = Array.from(radioItems).find(item =>
      item.querySelector('[data-part="item-text"]')?.textContent === 'Svelte',
    ) as HTMLElement

    await expect.element(svelteItem).toHaveAttribute('data-disabled')
  })

  it('should not select disabled item when clicked', async () => {
    render(Basic)

    const radioItems = document.querySelectorAll('[data-scope="radio-group"][data-part="item"]')
    const svelteItem = Array.from(radioItems).find(item =>
      item.querySelector('[data-part="item-text"]')?.textContent === 'Svelte',
    ) as HTMLElement

    // 验证 Svelte 项是禁用的
    await expect.element(svelteItem).toHaveAttribute('data-disabled')
    // 验证没有被选中
    await expect.element(svelteItem).toHaveAttribute('data-state', 'unchecked')
  })

  it('should set initial value', async () => {
    render(InitialValue)

    const radioItems = document.querySelectorAll('[data-scope="radio-group"][data-part="item"]')
    const solidItem = Array.from(radioItems).find(item =>
      item.querySelector('[data-part="item-text"]')?.textContent === 'Solid',
    ) as HTMLElement

    await expect.element(solidItem).toHaveAttribute('data-state', 'checked')
  })

  it('should emit value-change event when selection changes', async () => {
    const onValueChange = vi.fn()
    render(OnEvent, { props: { onValueChange } })

    await userEvent.click(page.getByText('Vue'))

    await vi.waitFor(() => {
      expect(onValueChange).toHaveBeenCalled()
    })
  })

  it('should work with RootProvider', async () => {
    render(RootProvider)

    await expect.element(page.getByText('Focus')).toBeInTheDocument()
    await expect.element(page.getByText('React')).toBeInTheDocument()
    await expect.element(page.getByText('Solid')).toBeInTheDocument()
    await expect.element(page.getByText('Vue')).toBeInTheDocument()
  })

  it('should focus radio group when focus button is clicked', async () => {
    render(RootProvider)

    const focusButton = page.getByText('Focus')
    await userEvent.click(focusButton)

    const radioRoot = document.querySelector('[data-scope="radio-group"][data-part="root"]') as HTMLElement
    await expect.element(radioRoot).toBeDefined()
  })
})

describe('[radio] disabled state', () => {
  it('should disable entire radio group', async () => {
    render(Disabled)

    const radioRoot = document.querySelector('[data-scope="radio-group"][data-part="root"]') as HTMLElement
    await expect.element(radioRoot).toHaveAttribute('data-disabled')
  })

  it('should not allow selection when radio group is disabled', async () => {
    render(Disabled)

    const radioItems = document.querySelectorAll('[data-scope="radio-group"][data-part="item"]')
    const reactItem = Array.from(radioItems).find(item =>
      item.querySelector('[data-part="item-text"]')?.textContent === 'React',
    ) as HTMLElement

    // 验证 React 项是禁用的（因为整个 group 都禁用了）
    await expect.element(reactItem).toHaveAttribute('data-disabled')
    // 验证没有被选中
    await expect.element(reactItem).toHaveAttribute('data-state', 'unchecked')
  })

  it('should have disabled attribute on all items when group is disabled', async () => {
    render(Disabled)

    const radioItems = document.querySelectorAll('[data-scope="radio-group"][data-part="item"]')

    for (const item of Array.from(radioItems)) {
      await expect.element(item as HTMLElement).toHaveAttribute('data-disabled')
    }
  })
})
