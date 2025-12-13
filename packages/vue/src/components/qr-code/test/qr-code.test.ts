import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import { page } from 'vitest/browser'
import { getExports, getParts } from '../../../../../../utils/test'
import Basic from '../examples/Basic.vue'
import WithOverlay from '../examples/WithOverlay.vue'
import { QrCode, qrCodeAnatomy } from '../index'

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

    await expect.element(page.getByAltText('Ark UI Logo')).toBeInTheDocument()
  })
})
