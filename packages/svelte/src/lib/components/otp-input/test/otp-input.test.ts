import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-svelte'
import { userEvent } from 'vitest/browser'
import Basic from '../examples/Basic.svelte'
import RootProvider from '../examples/RootProvider.svelte'
import WithField from '../examples/WithField.svelte'
import { OtpInput, otpInputAnatomy } from '../index'

const componentExports = OtpInput as unknown as Record<string, unknown>

describe('[otp-input] component', () => {
  it.each(otpInputAnatomy.keys())('renders part %s', async (part) => {
    await render(Basic)
    const dataPart = part.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)
    expect(document.querySelector(`[data-part="${dataPart}"]`)).not.toBeNull()
  })

  it.each(otpInputAnatomy.keys())('exports %s', (part) => {
    const exportName = `${part.charAt(0).toUpperCase()}${part.slice(1)}`
    expect(componentExports[exportName], `OtpInput.${exportName}`).toBeDefined()
  })

  it('labels each input by position', async () => {
    const screen = await render(Basic)
    await expect.element(screen.getByLabelText('pin code 1 of 3')).toBeVisible()
    await expect.element(screen.getByLabelText('pin code 2 of 3')).toBeVisible()
    await expect.element(screen.getByLabelText('pin code 3 of 3')).toBeVisible()
  })

  it('autofocuses the first input', async () => {
    const screen = await render(Basic, { props: { autoFocus: true } })
    await vi.waitFor(() => expect(screen.getByLabelText('pin code 1 of 3')).toHaveFocus())
  })

  it('moves focus forward and back while editing', async () => {
    const screen = await render(Basic)
    const first = screen.getByLabelText('pin code 1 of 3')
    const second = screen.getByLabelText('pin code 2 of 3')
    const third = screen.getByLabelText('pin code 3 of 3')
    await first.fill('1')
    await expect.element(second).toHaveFocus()
    await second.fill('2')
    await expect.element(third).toHaveFocus()
    await userEvent.keyboard('{Backspace}')
    await expect.element(second).toHaveFocus()
    await expect.element(second).toHaveValue('')
  })

  it('reports completion and can report it again', async () => {
    const onValueComplete = vi.fn()
    const screen = await render(Basic, { props: { onValueComplete } })
    await screen.getByLabelText('pin code 1 of 3').fill('1')
    await screen.getByLabelText('pin code 2 of 3').fill('2')
    const last = screen.getByLabelText('pin code 3 of 3')
    await last.fill('3')
    expect(onValueComplete).toHaveBeenCalledWith({ value: ['1', '2', '3'], valueAsString: '123' })
    onValueComplete.mockClear()
    await last.fill('')
    await last.fill('3')
    expect(onValueComplete).toHaveBeenCalledWith({ value: ['1', '2', '3'], valueAsString: '123' })
  })

  it('sets one-time-code autocomplete in otp mode', async () => {
    const screen = await render(Basic, { props: { otp: true } })
    await expect.element(screen.getByLabelText('pin code 1 of 3')).toHaveAttribute('autocomplete', 'one-time-code')
  })

  it('focuses through RootProvider', async () => {
    const screen = await render(RootProvider)
    await screen.getByRole('button', { name: 'Focus' }).click()
    await expect.element(screen.getByLabelText('pin code 1 of 3')).toHaveFocus()
  })
})

describe('[otp-input] field integration', () => {
  it('inherits disabled and readonly state', async () => {
    const disabled = await render(WithField, { props: { disabled: true } })
    await expect.element(disabled.getByLabelText('pin code 1 of 3')).toBeDisabled()
  })

  it('marks inputs readonly', async () => {
    const screen = await render(WithField, { props: { readOnly: true } })
    await expect.element(screen.getByLabelText('pin code 1 of 3')).toHaveAttribute('readonly')
  })

  it('renders helper and conditional error text', async () => {
    const screen = await render(WithField, { props: { invalid: true } })
    await expect.element(screen.getByText('Additional Info')).toBeVisible()
    await expect.element(screen.getByText('Error Info')).toBeVisible()
  })

  it('focuses the first input when its label is clicked', async () => {
    const screen = await render(WithField)
    await screen.getByText('Label').click()
    await expect.element(screen.getByLabelText('pin code 1 of 3')).toHaveFocus()
  })

  it('hides error text when valid', async () => {
    const screen = await render(WithField)
    await expect.element(screen.getByText('Error Info')).not.toBeInTheDocument()
  })
})
