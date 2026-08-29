import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-svelte'
import Basic from '../examples/Basic.svelte'
import Disabled from '../examples/Disabled.svelte'
import InitialValue from '../examples/InitialValue.svelte'
import OnEvent from '../examples/OnEvent.svelte'
import RootProvider from '../examples/RootProvider.svelte'
import { Radio, radioAnatomy } from '../index'

const componentExports = Radio as unknown as Record<string, unknown>

function item(label: string) {
  return Array.from(document.querySelectorAll<HTMLElement>('[data-scope="radio-group"][data-part="item"]'))
    .find(element => element.querySelector('[data-part="item-text"]')?.textContent === label)
}

describe('[radio] component', () => {
  it.each(radioAnatomy.keys())('renders part %s', async (part) => {
    await render(Basic)
    const dataPart = part.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)
    expect(document.querySelector(`[data-scope="radio-group"][data-part="${dataPart}"]`)).not.toBeNull()
  })

  it.each(radioAnatomy.keys())('exports %s', (part) => {
    const exportName = `${part.charAt(0).toUpperCase()}${part.slice(1)}`
    expect(componentExports[exportName], `Radio.${exportName}`).toBeDefined()
  })

  it('renders every item and switches selection', async () => {
    const screen = await render(Basic)
    for (const label of ['React', 'Solid', 'Vue', 'Svelte'])
      await expect.element(screen.getByText(label)).toBeVisible()
    await screen.getByText('React').click()
    await expect.element(item('React')!).toHaveAttribute('data-state', 'checked')
    await screen.getByText('Vue').click()
    await expect.element(item('Vue')!).toHaveAttribute('data-state', 'checked')
  })

  it('does not select a disabled item', async () => {
    const screen = await render(Basic)
    const svelte = item('Svelte')!
    await expect.element(svelte).toHaveAttribute('data-disabled')
    await screen.getByText('Svelte').click({ force: true })
    await expect.element(svelte).toHaveAttribute('data-state', 'unchecked')
  })

  it('supports an initial value', async () => {
    await render(InitialValue)
    await expect.element(item('Solid')!).toHaveAttribute('data-state', 'checked')
  })

  it('reports value changes', async () => {
    const onValueChange = vi.fn()
    const screen = await render(OnEvent, { props: { onValueChange } })
    expect(document.querySelectorAll('[data-scope="radio-group"][data-part="item"]')).toHaveLength(3)
    await screen.getByText('Vue').click()
    expect(onValueChange).toHaveBeenCalled()
  })

  it('works with RootProvider focus', async () => {
    const screen = await render(RootProvider)
    await screen.getByRole('button', { name: 'Focus' }).click()
    await expect.element(screen.getByText('React')).toBeVisible()
  })
})

describe('[radio] disabled state', () => {
  it('disables the root and every item', async () => {
    await render(Disabled)
    const root = document.querySelector('[data-scope="radio-group"][data-part="root"]')
    expect(root).toHaveAttribute('data-disabled')
    const items = document.querySelectorAll('[data-scope="radio-group"][data-part="item"]')
    expect(items).toHaveLength(3)
    for (const element of items) {
      expect(element).toHaveAttribute('data-disabled')
      expect(element).toHaveAttribute('data-state', 'unchecked')
    }
  })
})
