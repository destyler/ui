import type { UseQrCodeProps } from '../composables/use-qr-code'
import * as qrCode from '@destyler/qr-code'
import { normalizeProps } from '@destyler/vue'
import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import { page, userEvent } from 'vitest/browser'
import { getExports, getParts } from '../../../../../../utils/test'
import Basic from '../examples/Basic.vue'
import InitialValue from '../examples/InitialValue.vue'
import WithOverlay from '../examples/WithOverlay.vue'
import { QrCode, qrCodeAnatomy } from '../index'
import ValueState from './ValueState.vue'

describe('[qr-code] component', () => {
  it.each(getParts(qrCodeAnatomy))('should render part %s', async (part) => {
    render(Basic)
    expect(document.querySelector(part)).toBeInTheDocument()
  })

  it.each(getExports(qrCodeAnatomy))('should export %s', async (part) => {
    expect(QrCode[part]).toBeDefined()
  })

  it('should render the pattern path for the provided value', async () => {
    render(Basic)

    const patternPath = document.querySelector('[data-part="pattern"]')
    expect(patternPath).toBeInTheDocument()
    expect(patternPath?.getAttribute('d')).toBeTruthy()
  })

  it('should render overlay content', async () => {
    render(WithOverlay)

    await expect.element(page.getByAltText('Logo')).toBeInTheDocument()
  })

  it('seeds default* via InitialValue example', async () => {
    const screen = await render(InitialValue)
    expect(screen.container.querySelector('[data-part="pattern"]')).toHaveAttribute('d', expectedPattern('https://destyler.org'))
  })
})

function expectedPattern(value: string) {
  const service = qrCode.machine({ id: 'expected', value })
  return qrCode.connect(service.state, service.send, normalizeProps).getPatternProps().d
}

describe('qr-code value state', () => {
  it('keeps the edited value and encoded content when unrelated props and defaultValue change', async () => {
    const screen = await render(ValueState, { props: { defaultValue: 'https://destyler.org' } as UseQrCodeProps })
    await expect.element(page.getByTestId('value')).toHaveTextContent('https://destyler.org')
    await expect.element(page.getByTestId('pattern')).toHaveAttribute('d', expectedPattern('https://destyler.org'))
    await userEvent.click(page.getByRole('button', { name: 'Set value' }))
    await expect.element(page.getByTestId('value')).toHaveTextContent('https://updated.example')
    await expect.element(page.getByTestId('pattern')).toHaveAttribute('d', expectedPattern('https://updated.example'))

    await screen.rerender({ ids: { root: 'updated-qr-code' } })
    await expect.element(page.getByTestId('value')).toHaveTextContent('https://updated.example')
    await screen.rerender({ defaultValue: 'https://replacement.example' })
    await expect.element(page.getByTestId('value')).toHaveTextContent('https://updated.example')
    await expect.element(page.getByTestId('pattern')).toHaveAttribute('d', expectedPattern('https://updated.example'))
  })

  it('prefers an explicit empty value and re-encodes live value updates', async () => {
    const screen = await render(ValueState, { props: { defaultValue: 'https://destyler.org', modelValue: '' } as UseQrCodeProps })
    await expect.element(page.getByTestId('value')).toBeEmptyDOMElement()
    await expect.element(page.getByTestId('pattern')).toHaveAttribute('d', expectedPattern(''))
    await screen.rerender({ modelValue: 'https://updated.example' })
    await expect.element(page.getByTestId('value')).toHaveTextContent('https://updated.example')
    await expect.element(page.getByTestId('pattern')).toHaveAttribute('d', expectedPattern('https://updated.example'))
    await screen.rerender({ modelValue: '' })
    await expect.element(page.getByTestId('value')).toBeEmptyDOMElement()
    await expect.element(page.getByTestId('pattern')).toHaveAttribute('d', expectedPattern(''))
  })
})
