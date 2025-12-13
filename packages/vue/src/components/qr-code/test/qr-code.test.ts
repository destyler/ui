import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import { getExports, getParts } from '../../../../../../utils/test'
import Basic from '../examples/Basic.vue'
import { QrCode, qrCodeAnatomy } from '../index'

describe('[qr-code] component', () => {
  it.each(getParts(qrCodeAnatomy))('should render part %s', async (part) => {
    render(Basic)
    expect(document.querySelector(part)).toBeInTheDocument()
  })

  it.each(getExports(qrCodeAnatomy))('should export %s', async (part) => {
    expect(QrCode[part]).toBeDefined()
  })
})
