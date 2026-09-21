import { render } from '@solidjs/testing-library'
import { QrCode, qrCodeAnatomy } from '../'
import { expectExport, getExports, getParts } from '../../../setup-test'
import { ComponentUnderTest } from './basic'

describe('qrCode', () => {
  it.each(getParts(qrCodeAnatomy))('should render part %s', async (part) => {
    render(() => <ComponentUnderTest />)

    expect(document.querySelector(part)).toBeInTheDocument()
  })

  it.each(getExports(qrCodeAnatomy))('should export %s', async (part) => {
    expectExport(QrCode, part)
  })
})
