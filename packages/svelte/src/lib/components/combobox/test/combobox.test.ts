import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-svelte'
import Basic from '../examples/Basic.svelte'
import WithField from '../examples/WithField.svelte'
import { Combobox, comboboxAnatomy } from '../index'

const componentExports = Combobox as unknown as Record<string, unknown>

describe('[combobox] component', () => {
  it.each(comboboxAnatomy.keys())('renders and exports the %s anatomy part', async (part: string) => {
    const screen = await render(Basic)
    const dataPart = part.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)
    expect(screen.container.querySelector(`[data-scope="combobox"][data-part="${dataPart}"]`)).toBeInTheDocument()
    const exportName = `${part.charAt(0).toUpperCase()}${part.slice(1)}`
    expect(componentExports[exportName], `Combobox.${exportName}`).toBeDefined()
  })

  it('shows options on click', async () => {
    const screen = await render(Basic)
    await screen.getByText('Open').click()
    await expect.element(screen.getByRole('option', { name: 'React' })).toBeVisible()
  })

  it('handles item selection', async () => {
    const screen = await render(Basic)
    await screen.getByText('Open').click()
    await screen.getByRole('option', { name: 'React' }).click()
    await expect.element(screen.getByRole('combobox')).toHaveValue('React')
  })

  it('reports value and open changes', async () => {
    const onValueChange = vi.fn()
    const onOpenChange = vi.fn()
    const screen = await render(Basic, { props: { onValueChange, onOpenChange } })
    await screen.getByText('Open').click()
    expect(onOpenChange).toHaveBeenCalledTimes(1)
    await screen.getByRole('option', { name: 'React' }).click()
    expect(onValueChange).toHaveBeenCalledTimes(1)
  })

  it('does not open while readonly', async () => {
    const screen = await render(Basic, { props: { readOnly: true } })
    await screen.getByText('Open').click()
    await expect.element(screen.getByRole('option', { name: 'React' })).not.toBeInTheDocument()
  })

  it('supports lazy mounting', async () => {
    const screen = await render(Basic, { props: { lazyMount: true } })
    await expect.element(screen.getByTestId('positioner')).not.toBeInTheDocument()
    await screen.getByText('Open').click()
    await expect.element(screen.getByTestId('positioner')).toBeVisible()
  })

  it('supports lazy mounting and unmounting on exit', async () => {
    const screen = await render(Basic, { props: { lazyMount: true, unmountOnExit: true } })
    await expect.element(screen.getByTestId('positioner')).not.toBeInTheDocument()
    await screen.getByText('Open').click()
    await expect.element(screen.getByTestId('positioner')).toBeInTheDocument()
    await screen.getByText('Open').click()
    await vi.waitFor(async () => expect.element(screen.getByTestId('positioner')).not.toBeInTheDocument())
  })
})

describe('combobox / Field', () => {
  it('inherits required, disabled, and readonly state', async () => {
    const required = await render(WithField, { props: { required: true } })
    await expect.element(required.getByRole('combobox', { name: /label/i })).toBeRequired()
    required.unmount()

    const disabled = await render(WithField, { props: { disabled: true } })
    await expect.element(disabled.getByRole('combobox', { name: /label/i })).toBeDisabled()
    disabled.unmount()

    const readOnly = await render(WithField, { props: { readOnly: true } })
    await expect.element(readOnly.getByRole('combobox', { name: /label/i })).toHaveAttribute('readonly')
  })

  it('renders helper and conditional error text', async () => {
    const screen = await render(WithField, { props: { invalid: true } })
    await expect.element(screen.getByText('Additional Info')).toBeInTheDocument()
    await expect.element(screen.getByText('Error Info')).toBeInTheDocument()
  })

  it('focuses the combobox when its label is clicked', async () => {
    const screen = await render(WithField)
    await screen.getByText('Label').click()
    await expect.element(screen.getByRole('combobox', { name: /label/i })).toHaveFocus()
  })

  it('hides error text while valid', async () => {
    const screen = await render(WithField)
    await expect.element(screen.getByText('Error Info')).not.toBeInTheDocument()
  })
})
