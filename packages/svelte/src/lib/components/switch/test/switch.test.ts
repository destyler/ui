import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import Basic from '../examples/Basic.svelte'
import Controlled from '../examples/Controlled.svelte'
import RenderProp from '../examples/RenderProp.svelte'
import RootProvider from '../examples/RootProvider.svelte'
import WithField from '../examples/WithField.svelte'
import { Switch, switchAnatomy } from '../index'

const componentExports = Switch as unknown as Record<string, unknown>

describe('[switch] component', () => {
  it.each(switchAnatomy.keys())('renders part %s', async (part) => {
    await render(Basic)
    const dataPart = part.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)
    expect(document.querySelector(`[data-scope="switch"][data-part="${dataPart}"]`)).not.toBeNull()
  })

  it.each(switchAnatomy.keys())('exports %s', (part) => {
    const exportName = `${part.charAt(0).toUpperCase()}${part.slice(1)}`
    expect(componentExports[exportName], `Switch.${exportName}`).toBeDefined()
  })

  it('toggles checked state', async () => {
    const screen = await render(Basic)
    const input = screen.getByRole('checkbox')
    await expect.element(input).not.toBeChecked()
    await screen.getByText('Label').click()
    await expect.element(input).toBeChecked()
  })

  it('supports invalid and required state', async () => {
    const screen = await render(Basic, { props: { invalid: true, required: true } })
    const input = screen.getByRole('checkbox')
    await expect.element(input).toHaveAttribute('aria-invalid', 'true')
    await expect.element(input).toBeRequired()
  })

  it('supports controlled state and render context', async () => {
    const controlled = await render(Controlled)
    await expect.element(controlled.getByRole('checkbox')).toBeChecked()
    expect(controlled.container.querySelector('output')).toBeNull()
  })

  it('updates render context and RootProvider controls', async () => {
    const context = await render(RenderProp)
    await expect.element(context.getByText('Feature is disabled')).toBeVisible()
    await context.getByText('Feature is disabled').click()
    await expect.element(context.getByText('Feature is enabled')).toBeVisible()
  })

  it('toggles through RootProvider', async () => {
    const screen = await render(RootProvider)
    const input = screen.getByRole('checkbox')
    await screen.getByRole('button', { name: 'Toggle' }).click()
    await expect.element(input).toBeChecked()
  })
})

describe('[switch] field integration', () => {
  it('inherits required and disabled state', async () => {
    const required = await render(WithField, { props: { required: true } })
    await expect.element(required.getByRole('checkbox', { name: /label/i })).toBeRequired()
  })

  it('disables the switch', async () => {
    const screen = await render(WithField, { props: { disabled: true } })
    await expect.element(screen.getByRole('checkbox', { name: /label/i })).toBeDisabled()
  })

  it('renders helper and conditional error text', async () => {
    const screen = await render(WithField, { props: { invalid: true } })
    await expect.element(screen.getByText('Additional Info')).toBeVisible()
    await expect.element(screen.getByText('Error Info')).toBeVisible()
  })

  it('focuses the switch when its label is clicked', async () => {
    const screen = await render(WithField)
    await screen.getByText('Label').click()
    await expect.element(screen.getByRole('checkbox', { name: /label/i })).toHaveFocus()
  })

  it('hides error text when valid', async () => {
    const screen = await render(WithField)
    await expect.element(screen.getByText('Error Info')).not.toBeInTheDocument()
  })
})
