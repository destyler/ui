import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-svelte'
import Basic from '../examples/Basic.svelte'
import RootProvider from '../examples/RootProvider.svelte'
import WithField from '../examples/WithField.svelte'
import { ColorPicker, colorPickerAnatomy, parseColor } from '../index'

const componentExports = ColorPicker as unknown as Record<string, unknown>

describe('[color-picker] component', () => {
  it.each(colorPickerAnatomy.keys())('renders part %s', async (part) => {
    await render(Basic)
    const dataPart = part.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)
    expect(document.querySelector(`[data-scope="color-picker"][data-part="${dataPart}"]`)).not.toBeNull()
  })

  it.each(colorPickerAnatomy.keys())('exports %s', (part) => {
    const exportName = `${part.charAt(0).toUpperCase()}${part.slice(1)}`
    expect(componentExports[exportName], `ColorPicker.${exportName}`).toBeDefined()
  })

  it('lazy mounts and keeps content mounted by default', async () => {
    const screen = await render(Basic, { props: { lazyMount: true } })
    await expect.element(screen.getByTestId('positioner')).not.toBeInTheDocument()
    await screen.getByTestId('trigger').click()
    await expect.element(screen.getByTestId('positioner')).toBeInTheDocument()
    await screen.getByTestId('trigger').click()
    await expect.element(screen.getByTestId('positioner')).toBeInTheDocument()
  })

  it('unmounts content on exit when requested', async () => {
    const screen = await render(Basic, { props: { lazyMount: true, unmountOnExit: true } })
    await screen.getByTestId('trigger').click()
    await expect.element(screen.getByTestId('positioner')).toBeInTheDocument()
    await screen.getByTestId('trigger').click()
    await vi.waitFor(() => expect(document.querySelector('[data-testid="positioner"]')).toBeNull())
  })

  it('renders the supplied default value', async () => {
    const screen = await render(Basic, { props: { defaultValue: parseColor('#ff00ff') } })
    await expect.element(screen.getByTestId('swatch-trigger')).toHaveStyle({ backgroundColor: 'rgb(255, 0, 255)' })
  })

  it('works with RootProvider', async () => {
    const screen = await render(RootProvider)
    await expect.element(screen.getByText(/^Color:/)).toBeVisible()
    expect(document.querySelector('[data-scope="color-picker"][data-part="trigger"]')).not.toBeNull()
  })
})

describe('[color-picker] field integration', () => {
  it('supports required, disabled, and readonly inputs', async () => {
    const required = await render(WithField, { props: { required: true } })
    await expect.element(required.getByRole('textbox', { name: /label/i })).toBeRequired()
  })

  it('disables channel inputs', async () => {
    const screen = await render(WithField, { props: { disabled: true } })
    await expect.element(screen.getByRole('textbox', { name: /label/i })).toBeDisabled()
  })

  it('marks channel inputs readonly', async () => {
    const screen = await render(WithField, { props: { readOnly: true } })
    await expect.element(screen.getByRole('textbox', { name: /label/i })).toHaveAttribute('readonly')
  })

  it('renders helper and conditional error text', async () => {
    const screen = await render(WithField, { props: { invalid: true } })
    await expect.element(screen.getByText('Additional Info')).toBeVisible()
    await expect.element(screen.getByText('Error Info')).toBeVisible()
  })

  it('focuses the hex input when its label is clicked', async () => {
    const screen = await render(WithField)
    await screen.getByText('Label').click()
    await expect.element(screen.getByRole('textbox', { name: /hex/i })).toHaveFocus()
  })

  it('hides field error text when valid', async () => {
    const screen = await render(WithField)
    await expect.element(screen.getByText('Error Info')).not.toBeInTheDocument()
  })
})
