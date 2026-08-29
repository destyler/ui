import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-svelte'
import Basic from '../examples/Basic.svelte'
import Controlled from '../examples/Controlled.svelte'
import ReactiveCollection from '../examples/ReactiveCollection.svelte'
import WithField from '../examples/WithField.svelte'
import { Select, selectAnatomy } from '../index'

const componentExports = Select as unknown as Record<string, unknown>

describe('[select] component', () => {
  it.each(selectAnatomy.keys())('renders part %s', async (part) => {
    const screen = await render(Basic)
    const dataPart = part.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)
    expect(document.querySelector(`[data-scope="select"][data-part="${dataPart}"]`)).not.toBeNull()
    expect(screen.container).toBeDefined()
  })

  it.each(selectAnatomy.keys())('exports %s', (part) => {
    const exportName = `${part.charAt(0).toUpperCase()}${part.slice(1)}`
    expect(componentExports[exportName], `Select.${exportName}`).toBeDefined()
  })

  it('selects an item and closes the list', async () => {
    const screen = await render(Basic)
    const trigger = screen.getByRole('combobox', { name: 'Framework' })
    await trigger.click()
    await screen.getByTestId('positioner').getByText('React').click()
    await expect.element(trigger).toHaveTextContent('React')
    await expect.element(screen.getByText('Frameworks')).not.toBeVisible()
  })

  it('supports multiple selection', async () => {
    const screen = await render(Basic, { props: { multiple: true } })
    const trigger = screen.getByRole('combobox', { name: 'Framework' })
    await trigger.click()
    const positioner = screen.getByTestId('positioner')
    await positioner.getByText('React').click()
    await positioner.getByText('Vue').click()
    await expect.element(trigger).toHaveTextContent('React, Vue')
  })

  it('keeps controlled and reactive examples aligned with the shared DOM', async () => {
    const controlled = await render(Controlled)
    expect(controlled.container.querySelector('output')).toBeNull()

    const reactive = await render(ReactiveCollection)
    expect(reactive.container.querySelector('[data-part="positioner"]')).not.toBeNull()
  })

  it('reports value and open changes', async () => {
    const onValueChange = vi.fn()
    const onOpenChange = vi.fn()
    const screen = await render(Basic, { props: { onValueChange, onOpenChange } })
    await screen.getByRole('combobox', { name: 'Framework' }).click()
    expect(onOpenChange).toHaveBeenCalledTimes(1)
    await screen.getByTestId('positioner').getByText('React').click()
    expect(onValueChange).toHaveBeenCalledTimes(1)
  })

  it('honors disabled and readonly state', async () => {
    const disabled = await render(Basic, { props: { disabled: true } })
    await expect.element(disabled.getByRole('combobox', { name: 'Framework' })).toBeDisabled()
  })

  it('does not open while readonly', async () => {
    const screen = await render(Basic, { props: { readOnly: true } })
    await screen.getByRole('combobox', { name: 'Framework' }).click()
    await expect.element(screen.getByTestId('positioner')).not.toBeVisible()
  })

  it('supports lazy mount and unmount on exit', async () => {
    const screen = await render(Basic, { props: { lazyMount: true, unmountOnExit: true } })
    await expect.element(screen.getByTestId('positioner')).not.toBeInTheDocument()
    const trigger = screen.getByRole('combobox', { name: 'Framework' })
    await trigger.click()
    await expect.element(screen.getByTestId('positioner')).toBeInTheDocument()
    await trigger.click()
    await vi.waitFor(async () => expect(document.querySelector('[data-testid="positioner"]')).toBeNull())
  })
})

describe('[select] field integration', () => {
  it('inherits disabled and readonly state', async () => {
    const disabled = await render(WithField, { props: { disabled: true } })
    await expect.element(disabled.getByRole('combobox')).toBeDisabled()
  })

  it('marks a readonly trigger', async () => {
    const screen = await render(WithField, { props: { readOnly: true } })
    await expect.element(screen.getByRole('combobox')).toHaveAttribute('data-readonly')
  })

  it('renders helper and conditional error text', async () => {
    const screen = await render(WithField, { props: { invalid: true } })
    await expect.element(screen.getByText('Additional Info')).toBeVisible()
    await expect.element(screen.getByText('Error Info')).toBeVisible()
  })

  it('focuses the trigger when its label is clicked', async () => {
    const screen = await render(WithField)
    await screen.getByText('Label').click()
    await expect.element(screen.getByRole('combobox', { name: /label/i })).toHaveFocus()
  })

  it('hides field error text when valid', async () => {
    const screen = await render(WithField)
    await expect.element(screen.getByText('Error Info')).not.toBeInTheDocument()
  })
})
