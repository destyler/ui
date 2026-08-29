import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import Basic from '../examples/Basic.svelte'
import Controlled from '../examples/Controlled.svelte'
import WithOverlay from '../examples/WithOverlay.svelte'
import { QrCode, qrCodeAnatomy } from '../index'

const componentExports = QrCode as unknown as Record<string, unknown>
const partName = (part: string) => part.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)

describe('[qr-code] component', () => {
  it.each(qrCodeAnatomy.keys())('renders and exports the %s anatomy part', async (part) => {
    const screen = await render(Basic)
    expect(screen.container.querySelector(`[data-scope="qr-code"][data-part="${partName(part)}"]`)).toBeInTheDocument()
    const exportName = `${part.charAt(0).toUpperCase()}${part.slice(1)}`
    expect(componentExports[exportName], `QrCode.${exportName}`).toBeDefined()
  })

  it('renders a generated pattern and overlay content', async () => {
    const basic = await render(Basic)
    const pattern = basic.getByTestId('pattern')
    await expect.element(pattern).toBeInTheDocument()
    await expect.element(pattern).toHaveAttribute('d')
    basic.unmount()

    const overlay = await render(WithOverlay)
    await expect.element(overlay.getByAltText('Logo')).toBeInTheDocument()
  })

  it('renders the controlled example without adding controls absent from React and Vue', async () => {
    const screen = await render(Controlled)
    const pattern = screen.container.querySelector('[data-part="pattern"]')
    expect(pattern).toHaveAttribute('d')
    expect(screen.container.querySelector('input')).toBeNull()
  })
})
