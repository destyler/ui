import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import { userEvent } from 'vitest/browser'
import Basic from '../examples/Basic.svelte'
import Controlled from '../examples/Controlled.svelte'
import WithField from '../examples/WithField.svelte'
import { Edit, editAnatomy } from '../index'

const componentExports = Edit as unknown as Record<string, unknown>

describe('[edit] component', () => {
  it.each(editAnatomy.keys())('renders and exports the %s anatomy part', async (part: string) => {
    const screen = await render(Basic)
    const dataPart = part.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)
    expect(screen.container.querySelector(`[data-scope="edit"][data-part="${dataPart}"]`)).toBeInTheDocument()
    const exportName = `${part.charAt(0).toUpperCase()}${part.slice(1)}`
    expect(componentExports[exportName], `Edit.${exportName}`).toBeDefined()
  })

  it('focuses the placeholder and accepts a value', async () => {
    const screen = await render(Controlled)
    await screen.getByText('Placeholder').click()
    const input = screen.getByLabelText('editable input')
    await expect.element(input).toBeVisible()
    await userEvent.type(input, 'React')
    await expect.element(screen.getByText('React')).toBeInTheDocument()
  })

  it('supports double-click activation', async () => {
    const screen = await render(Controlled, { props: { activationMode: 'dblclick' } })
    await userEvent.dblClick(screen.getByText('Placeholder'))
    const input = screen.getByRole('textbox')
    await userEvent.clear(input)
    await userEvent.type(input, 'React')
    await expect.element(screen.getByText('React')).toBeInTheDocument()
  })

  it('hides the input when cancel is clicked', async () => {
    const screen = await render(Controlled, { props: { activationMode: 'dblclick' } })
    await userEvent.dblClick(screen.getByText('Placeholder'))
    const input = screen.getByLabelText('editable input')
    await expect.element(input).not.toHaveAttribute('hidden')
    await screen.getByRole('button', { name: 'cancel' }).click()
    await expect.element(input).toHaveAttribute('hidden')
  })
})

describe('edit / Field', () => {
  it('inherits required, disabled, and readonly state', async () => {
    const required = await render(WithField, { props: { required: true } })
    await expect.element(required.getByLabelText('editable input')).toBeRequired()
    required.unmount()

    const disabled = await render(WithField, { props: { disabled: true } })
    await expect.element(disabled.getByLabelText('editable input')).toBeDisabled()
    disabled.unmount()

    const readOnly = await render(WithField, { props: { readOnly: true } })
    await expect.element(readOnly.getByLabelText('editable input')).toHaveAttribute('readonly')
  })

  it('renders helper and conditional error text', async () => {
    const screen = await render(WithField, { props: { invalid: true } })
    await expect.element(screen.getByText('Additional Info')).toBeInTheDocument()
    await expect.element(screen.getByText('Error Info')).toBeInTheDocument()
  })

  it('hides error text while valid', async () => {
    const screen = await render(WithField)
    await expect.element(screen.getByText('Error Info')).not.toBeInTheDocument()
  })
})
