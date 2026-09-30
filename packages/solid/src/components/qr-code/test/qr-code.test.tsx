import * as qrCode from '@destyler/qr-code'
import { normalizeProps } from '@destyler/solid'
import { render, screen, waitFor } from '@solidjs/testing-library'
import user from '@testing-library/user-event'
import { createSignal } from 'solid-js'
import { QrCode, qrCodeAnatomy } from '../'
import { expectExport, getExports, getParts } from '../../../setup-test'
import { InitialValue } from '../examples/InitialValue'
import { ComponentUnderTest } from './basic'

function expectedPattern(value: string, encoding?: qrCode.Context['encoding']) {
  const service = qrCode.machine({ id: 'reference', value, encoding }).start()
  const pattern = qrCode.connect(service.state, service.send, normalizeProps).getPatternProps().d
  service.stop()
  return pattern
}

function ValueUnderTest(props: QrCode.RootProps) {
  return (
    <QrCode.Root {...props}>
      <QrCode.Frame><QrCode.Pattern data-testid="pattern" /></QrCode.Frame>
      <QrCode.Context>
        {api => (
          <>
            <output data-testid="value">{JSON.stringify(api().value)}</output>
            <button type="button" onClick={() => api().setValue('Edited')}>Edit value</button>
            <button type="button" onClick={() => api().setValue('')}>Clear value</button>
          </>
        )}
      </QrCode.Context>
    </QrCode.Root>
  )
}

describe('qrCode', () => {
  it.each(getParts(qrCodeAnatomy))('should render part %s', async (part) => {
    render(() => <ComponentUnderTest />)

    expect(document.querySelector(part)).toBeInTheDocument()
  })

  it.each(getExports(qrCodeAnatomy))('should export %s', async (part) => {
    expectExport(QrCode, part)
  })

  it('encodes defaultValue in the InitialValue example', async () => {
    render(() => <InitialValue />)
    const pattern = document.querySelector('[data-part="pattern"], [data-testid="pattern"]')
    expect(pattern).toHaveAttribute('d', expectedPattern('https://destyler.org'))
  })
})

describe('qrCode / initial value', () => {
  it.each([
    { value: undefined, expected: 'Default' },
    { value: 'Live', expected: 'Live' },
    { value: '', expected: '' },
  ])('prefers the supplied live value, including "$value"', ({ value, expected }) => {
    render(() => <ValueUnderTest defaultValue="Default" value={value} />)
    expect(screen.getByTestId('value')).toHaveTextContent(JSON.stringify(expected))
    expect(screen.getByTestId('pattern')).toHaveAttribute('d', expectedPattern(expected))
  })

  it('updates the encoded live value, including an empty string', async () => {
    const [value, setValue] = createSignal('First')
    render(() => <ValueUnderTest defaultValue="Default" value={value()} />)

    setValue('Second')
    await waitFor(() => expect(screen.getByTestId('pattern')).toHaveAttribute('d', expectedPattern('Second')))
    setValue('')
    await waitFor(() => expect(screen.getByTestId('pattern')).toHaveAttribute('d', expectedPattern('')))
    expect(screen.getByTestId('value')).toHaveTextContent('""')
  })

  it('keeps internal edits when encoding and defaultValue change', async () => {
    const [defaultValue, setDefaultValue] = createSignal('Default')
    const [encoding, setEncoding] = createSignal<qrCode.Context['encoding']>({ ecc: 'L' })
    render(() => <ValueUnderTest defaultValue={defaultValue()} encoding={encoding()} />)

    await user.click(screen.getByText('Edit value'))
    await waitFor(() => expect(screen.getByTestId('pattern')).toHaveAttribute('d', expectedPattern('Edited', { ecc: 'L' })))

    setEncoding({ ecc: 'H' })
    await waitFor(() => expect(screen.getByTestId('pattern')).toHaveAttribute('d', expectedPattern('Edited', { ecc: 'H' })))
    setDefaultValue('Replacement')
    await waitFor(() => expect(screen.getByTestId('value')).toHaveTextContent('"Edited"'))

    await user.click(screen.getByText('Clear value'))
    setDefaultValue('Another default')
    setEncoding({ ecc: 'L' })
    await waitFor(() => expect(screen.getByTestId('pattern')).toHaveAttribute('d', expectedPattern('', { ecc: 'L' })))
    expect(screen.getByTestId('value')).toHaveTextContent('""')
  })
})
