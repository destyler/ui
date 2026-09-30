import { normalizeProps } from '$lib/utils/normalize-props'
import * as qrCode from '@destyler/qr-code'
import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import Basic from '../examples/Basic.svelte'
import Controlled from '../examples/Controlled.svelte'
import InitialValue from '../examples/InitialValue.svelte'
import WithOverlay from '../examples/WithOverlay.svelte'
import { QrCode, qrCodeAnatomy } from '../index'
import ValueUnderTest from './ValueUnderTest.svelte'

function expectedPattern(value: string, encoding?: qrCode.Context['encoding']) {
  const service = qrCode.machine({ id: 'reference', value, encoding }).start()
  const pattern = qrCode.connect(service.state, service.send, normalizeProps).getPatternProps().d
  service.stop()
  return pattern
}

const componentExports = QrCode as unknown as Record<string, unknown>
const partName = (part: string) => part.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)

describe('[qr-code] component', () => {
  it.each<[string]>(qrCodeAnatomy.keys().map((part: string) => [part] as [string]))('renders and exports the %s anatomy part', async (part) => {
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

  it('encodes defaultValue in the InitialValue example', async () => {
    await render(InitialValue)
    const pattern = document.querySelector('[data-part="pattern"], [data-testid="pattern"]')
    expect(pattern).toHaveAttribute('d', expectedPattern('https://destyler.org'))
  })
})

describe('qrCode / initial value', () => {
  it.each([
    { value: undefined, expected: 'Default' },
    { value: 'Live', expected: 'Live' },
    { value: '', expected: '' },
  ])('prefers the supplied live value, including "$value"', async ({ value, expected }) => {
    const screen = await render(ValueUnderTest, { props: { defaultValue: 'Default', value } })
    await expect.element(screen.getByTestId('value')).toHaveTextContent(JSON.stringify(expected))
    await expect.element(screen.getByTestId('pattern')).toHaveAttribute('d', expectedPattern(expected))
  })

  it('updates the encoded live value, including an empty string', async () => {
    const screen = await render(ValueUnderTest, { props: { defaultValue: 'Default', value: 'First' } })

    await screen.rerender({ value: 'Second' })
    await expect.element(screen.getByTestId('pattern')).toHaveAttribute('d', expectedPattern('Second'))
    await screen.rerender({ value: '' })
    await expect.element(screen.getByTestId('pattern')).toHaveAttribute('d', expectedPattern(''))
    await expect.element(screen.getByTestId('value')).toHaveTextContent('""')
  })

  it('keeps internal edits when encoding and defaultValue change', async () => {
    const screen = await render(ValueUnderTest, { props: { defaultValue: 'Default', encoding: { ecc: 'L' } } })

    await screen.getByText('Edit value').click()
    await expect.element(screen.getByTestId('pattern')).toHaveAttribute('d', expectedPattern('Edited', { ecc: 'L' }))

    await screen.rerender({ encoding: { ecc: 'H' } })
    await expect.element(screen.getByTestId('pattern')).toHaveAttribute('d', expectedPattern('Edited', { ecc: 'H' }))
    await screen.rerender({ defaultValue: 'Replacement' })
    await expect.element(screen.getByTestId('value')).toHaveTextContent('"Edited"')

    await screen.getByText('Clear value').click()
    await screen.rerender({ defaultValue: 'Another default', encoding: { ecc: 'L' } })
    await expect.element(screen.getByTestId('pattern')).toHaveAttribute('d', expectedPattern('', { ecc: 'L' }))
    await expect.element(screen.getByTestId('value')).toHaveTextContent('""')
  })
})
