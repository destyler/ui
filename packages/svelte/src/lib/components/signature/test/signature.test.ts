import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-svelte'
import Basic from '../examples/Basic.svelte'
import ImagePreview from '../examples/ImagePreview.svelte'
import RootProvider from '../examples/RootProvider.svelte'
import WithField from '../examples/WithField.svelte'
import { Signature, signatureAnatomy } from '../index'

const componentExports = Signature as unknown as Record<string, unknown>

async function drawSignature() {
  const control = document.querySelector<HTMLElement>('[data-scope="signature"][data-part="control"]')
  expect(control).not.toBeNull()
  const setPointerCapture = vi.spyOn(control!, 'setPointerCapture').mockImplementation(() => {})
  const pointerId = 1

  control!.dispatchEvent(new PointerEvent('pointerdown', {
    bubbles: true,
    button: 0,
    buttons: 1,
    clientX: 10,
    clientY: 10,
    pointerId,
    pointerType: 'pen',
    pressure: 0.5,
  }))
  setPointerCapture.mockRestore()

  for (const [clientX, clientY] of [[20, 20], [30, 25], [40, 20], [50, 30]]) {
    document.dispatchEvent(new PointerEvent('pointermove', {
      bubbles: true,
      button: -1,
      buttons: 1,
      clientX,
      clientY,
      pointerId,
      pointerType: 'pen',
      pressure: 0.5,
    }))
  }
  document.dispatchEvent(new PointerEvent('pointerup', {
    bubbles: true,
    button: 0,
    clientX: 50,
    clientY: 30,
    pointerId,
    pointerType: 'pen',
  }))

  await vi.waitFor(() => {
    expect(document.querySelectorAll('[data-scope="signature"][data-part="segment-path"]')).toHaveLength(1)
  })

  return control!
}

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

  it('clears a drawn signature with the clear trigger', async () => {
    const screen = await render(Basic)
    const clear = document.querySelector('[data-scope="signature"][data-part="clear-trigger"]')
    expect(clear).toHaveAttribute('hidden')

    const control = await drawSignature()
    expect(clear).not.toHaveAttribute('hidden')
    await screen.getByRole('button', { name: 'Clear' }).click()

    await vi.waitFor(() => {
      expect(document.querySelector('[data-scope="signature"][data-part="segment-path"]')).toBeNull()
    })
    expect(clear).toHaveAttribute('hidden')
    expect(control).toHaveFocus()
  })

  it('clears a drawn signature through the RootProvider API', async () => {
    const screen = await render(RootProvider)
    const control = await drawSignature()
    const clear = document.querySelector('[data-scope="signature"][data-part="clear-trigger"]')
    expect(clear).not.toHaveAttribute('hidden')

    await screen.getByRole('button', { name: 'Clear' }).first().click()

    await vi.waitFor(() => {
      expect(document.querySelector('[data-scope="signature"][data-part="segment-path"]')).toBeNull()
    })
    expect(clear).toHaveAttribute('hidden')
    expect(control).toHaveFocus()
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
