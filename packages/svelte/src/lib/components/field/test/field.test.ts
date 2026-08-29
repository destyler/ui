import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import AllParts from '../examples/AllParts.svelte'
import Basic from '../examples/Basic.svelte'
import Disabled from '../examples/Disabled.svelte'
import InputControlled from '../examples/InputControlled.svelte'
import { Field, fieldAnatomy } from '../index'
import BindableControls from './BindableControls.svelte'

describe('[field] component', () => {
  it.each(fieldAnatomy.keys())('renders part %s', async (part) => {
    const screen = await render(AllParts)
    const dataPart = part.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)
    expect(screen.container.querySelector(`[data-scope="field"][data-part="${dataPart}"]`)).not.toBeNull()
  })

  it.each(fieldAnatomy.keys())('exports %s', (part) => {
    const name = `${part.charAt(0).toUpperCase()}${part.slice(1)}` as keyof typeof Field
    expect(Field[name]).toBeDefined()
  })

  it('sets the textbox as required and renders the required indicator', async () => {
    const screen = await render(Basic, { props: { required: true } })
    await expect.element(screen.getByRole('textbox', { name: /label/i })).toBeRequired()
    await expect.element(screen.getByText('*')).toBeVisible()
  })

  it('propagates disabled state to the field parts', async () => {
    const screen = await render(Disabled)
    await expect.element(screen.getByRole('textbox', { name: /label/i })).toBeDisabled()
    await expect.element(screen.getByTestId('root')).toHaveAttribute('data-disabled')
    await expect.element(screen.getByText('Label')).toHaveAttribute('data-disabled')
    await expect.element(screen.getByText('Some additional Info')).toHaveAttribute('data-disabled')
  })

  it('sets the textbox as readonly', async () => {
    const screen = await render(Basic, { props: { readOnly: true } })
    await expect.element(screen.getByRole('textbox', { name: /label/i })).toHaveAttribute('readonly')
  })

  it('shows helper and conditional error text', async () => {
    const invalid = await render(Basic, { props: { invalid: true } })
    await expect.element(invalid.getByText('Some additional Info')).toBeVisible()
    await expect.element(invalid.getByText('Error Info')).toBeVisible()
  })

  it('hides error text when valid', async () => {
    const screen = await render(Basic, { props: { invalid: false } })
    await expect.element(screen.getByText('Error Info')).not.toBeInTheDocument()
  })

  it('focuses the input when its label is clicked', async () => {
    const screen = await render(Basic)
    await screen.getByText('Label').click()
    await expect.element(screen.getByRole('textbox', { name: /label/i })).toHaveFocus()
  })

  it('keeps a controlled input in sync', async () => {
    const screen = await render(InputControlled)
    const input = screen.getByRole('textbox', { name: /label/i })
    await expect.element(input).toHaveValue('Input is controlled')
    await input.fill('Updated')
    await expect.element(screen.getByText('Input text: Updated')).toBeVisible()
  })

  it('supports bind:value for input, textarea, and select controls', async () => {
    const screen = await render(BindableControls)
    const input = screen.getByRole('textbox', { name: 'Input' })
    const textarea = screen.getByRole('textbox', { name: 'Textarea' })
    const select = screen.getByRole('combobox', { name: 'Select' })

    await expect.element(input).toHaveValue('Initial input')
    await expect.element(textarea).toHaveValue('Initial textarea')
    await expect.element(select).toHaveValue('one')

    await input.fill('Updated input')
    await textarea.fill('Updated textarea')
    const selectElement = select.element() as HTMLSelectElement
    selectElement.value = 'two'
    selectElement.dispatchEvent(new Event('input', { bubbles: true }))

    await expect.element(screen.getByTestId('input-value')).toHaveTextContent('Updated input')
    await expect.element(screen.getByTestId('textarea-value')).toHaveTextContent('Updated textarea')
    await expect.element(screen.getByTestId('select-value')).toHaveTextContent('two')
  })
})
