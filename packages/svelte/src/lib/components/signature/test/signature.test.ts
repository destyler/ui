import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import Basic from '../examples/Basic.svelte'
import ImagePreview from '../examples/ImagePreview.svelte'
import RootProvider from '../examples/RootProvider.svelte'
import WithField from '../examples/WithField.svelte'
import { Signature, signatureAnatomy } from '../index'

const componentExports = Signature as unknown as Record<string, unknown>

describe('[signature] component', () => {
  it.each(signatureAnatomy.keys().filter(part => part !== 'segmentPath'))('renders part %s', async (part) => {
    await render(Basic)
    const dataPart = part.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)
    expect(document.querySelector(`[data-scope="signature"][data-part="${dataPart}"]`)).not.toBeNull()
  })

  it.each(signatureAnatomy.keys().filter(part => part !== 'segmentPath'))('exports %s', (part) => {
    const exportName = `${part.charAt(0).toUpperCase()}${part.slice(1)}`
    expect(componentExports[exportName], `Signature.${exportName}`).toBeDefined()
  })

  it('renders a labelled drawing control and clear button', async () => {
    const screen = await render(Basic)
    await expect.element(screen.getByText('Sign below')).toBeVisible()
    const control = document.querySelector('[data-part="control"]')
    expect(control).toHaveAttribute('role', 'application')
    expect(control).toHaveAttribute('tabindex', '0')
    const clear = document.querySelector('[data-part="clear-trigger"]')
    expect(clear).toHaveAttribute('type', 'button')
    expect(clear).toHaveAttribute('aria-label', 'clear signature')
  })

  it('renders its svg segment and guide', async () => {
    await render(Basic)
    expect(document.querySelector('svg[data-part="segment"]')).not.toBeNull()
    expect(document.querySelector('[data-part="guide"]')).not.toBeNull()
  })

  it('supports image preview configuration', async () => {
    await render(ImagePreview)
    expect(document.querySelector('[data-part="segment"]')).toHaveAttribute('fill', 'orange')
    expect(document.querySelector('img[alt="Signature preview"]')).toBeNull()
  })

  it('works with RootProvider and an external clear action', async () => {
    const screen = await render(RootProvider)
    const buttons = screen.getByRole('button', { name: 'Clear' })
    await expect.element(buttons.first()).toBeVisible()
    await expect.element(buttons.last()).toBeVisible()
    await buttons.first().click()
    expect(document.querySelector('[data-part="control"]')).not.toBeNull()
  })
})

describe('[signature] field integration', () => {
  it('renders the field content and hidden form input', async () => {
    const screen = await render(WithField)
    await expect.element(screen.getByText('Label')).toBeVisible()
    const input = document.querySelector('input[hidden]') as HTMLInputElement | null
    expect(input).not.toBeNull()
    expect(input?.value).toBe('')
  })

  it('renders helper and conditional error text', async () => {
    const screen = await render(WithField, { props: { invalid: true } })
    await expect.element(screen.getByText('Additional Info')).toBeVisible()
    await expect.element(screen.getByText('Error Info')).toBeVisible()
  })

  it('renders a working clear button', async () => {
    await render(WithField)
    expect(document.querySelector('[data-part="clear-trigger"]')).toHaveAttribute('type', 'button')
  })
})
