import type { UseQrCodeProps } from '../hooks/use-qr-code'
import * as qrCode from '@destyler/qr-code'
import { normalizeProps } from '@destyler/react'
import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { page, userEvent } from 'vitest/browser'
import { getExports, getParts } from '../../../../../../utils/test'
import { Basic } from '../examples/Basic'
import { InitialValue } from '../examples/InitialValue'
import { WithOverlay } from '../examples/WithOverlay'
import { QrCode, qrCodeAnatomy } from '../index'

describe('[qr-code] component', () => {
  it.each(getParts(qrCodeAnatomy))('should render part %s', async (part) => {
    render(<Basic />)
    expect(document.querySelector(part)).toBeInTheDocument()
  })

  it.each(getExports(qrCodeAnatomy))('should export %s', async (part) => {
    expect(QrCode).toHaveProperty(part, expect.anything())
  })

  it('should render the pattern path for the provided value', async () => {
    render(<Basic />)

    await expect.element(page.getByTestId('pattern')).toBeInTheDocument()
  })

  it('should render overlay content', async () => {
    render(<WithOverlay />)

    await expect.element(page.getByAltText('Logo')).toBeInTheDocument()
  })

  it('seeds default* via InitialValue example', async () => {
    render(<InitialValue />)
    await expect.element(page.getByTestId('pattern')).toHaveAttribute('d', expectedPattern('https://destyler.org'))
  })
})

function expectedPattern(value: string) {
  const service = qrCode.machine({ id: 'expected', value })
  return qrCode.connect(service.state, service.send, normalizeProps).getPatternProps().d
}

function ValueState(props: UseQrCodeProps) {
  return (
    <QrCode.Root {...props}>
      <QrCode.Context>
        {api => (
          <>
            <output data-testid="value">{api.value}</output>
            <button type="button" onClick={() => api.setValue('https://updated.example')}>Set value</button>
          </>
        )}
      </QrCode.Context>
      <QrCode.Frame><QrCode.Pattern data-testid="pattern" /></QrCode.Frame>
    </QrCode.Root>
  )
}

describe('qr-code value state', () => {
  it('keeps the edited value and encoded content when unrelated props and defaultValue change', async () => {
    const screen = await render(<ValueState defaultValue="https://destyler.org" />)
    await expect.element(page.getByTestId('value')).toHaveTextContent('https://destyler.org')
    await expect.element(page.getByTestId('pattern')).toHaveAttribute('d', expectedPattern('https://destyler.org'))
    await userEvent.click(page.getByRole('button', { name: 'Set value' }))
    await expect.element(page.getByTestId('value')).toHaveTextContent('https://updated.example')
    await expect.element(page.getByTestId('pattern')).toHaveAttribute('d', expectedPattern('https://updated.example'))

    await screen.rerender(<ValueState defaultValue="https://destyler.org" ids={{ root: 'updated-qr-code' }} />)
    await expect.element(page.getByTestId('value')).toHaveTextContent('https://updated.example')
    await screen.rerender(<ValueState defaultValue="https://replacement.example" />)
    await expect.element(page.getByTestId('value')).toHaveTextContent('https://updated.example')
    await expect.element(page.getByTestId('pattern')).toHaveAttribute('d', expectedPattern('https://updated.example'))
  })

  it('prefers an explicit empty value and re-encodes live value updates', async () => {
    const screen = await render(<ValueState defaultValue="https://destyler.org" value="" />)
    await expect.element(page.getByTestId('value')).toBeEmptyDOMElement()
    await expect.element(page.getByTestId('pattern')).toHaveAttribute('d', expectedPattern(''))
    await screen.rerender(<ValueState defaultValue="https://destyler.org" value="https://updated.example" />)
    await expect.element(page.getByTestId('value')).toHaveTextContent('https://updated.example')
    await expect.element(page.getByTestId('pattern')).toHaveAttribute('d', expectedPattern('https://updated.example'))
    await screen.rerender(<ValueState defaultValue="https://destyler.org" value="" />)
    await expect.element(page.getByTestId('value')).toBeEmptyDOMElement()
    await expect.element(page.getByTestId('pattern')).toHaveAttribute('d', expectedPattern(''))
  })
})
