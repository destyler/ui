import { render } from '@solidjs/testing-library'
import { QrCode, qrCodeAnatomy } from '../'
import { expectExport, getExports, getParts } from '../../../setup-test'
import { InitialValue } from '../examples/InitialValue'
import { ComponentUnderTest } from './basic'

describe('qrCode', () => {
  it.each(getParts(qrCodeAnatomy))('should render part %s', async (part) => {
    render(() => <ComponentUnderTest />)

    expect(document.querySelector(part)).toBeInTheDocument()
  })

  it.each(getExports(qrCodeAnatomy))('should export %s', async (part) => {
    expectExport(QrCode, part)
  })

  it('seeds default* via InitialValue example', async () => {
    render(() => <InitialValue />)
    const pattern = document.querySelector('[data-part="pattern"], [data-testid="pattern"]')
    expect(pattern).toBeTruthy()
  })
})
