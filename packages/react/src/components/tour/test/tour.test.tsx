import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { getExports, getParts } from '../../../../../../utils/test'
import { Basic } from '../examples/Basic'
import { Tour, tourAnatomy } from '../index'

describe('[tour] component', () => {
  it.each(getParts(tourAnatomy))('should render part %s', async (part) => {
    await render(<Basic />)
    await vi.waitFor(() => {
      expect(document.querySelector(part)).toBeInTheDocument()
    })
  })

  it.each(getExports(tourAnatomy))('should export %s', async (part) => {
    expect(Tour).toHaveProperty(part, expect.anything())
  })

  it('uses standard previous and next actions at the one-step boundaries', async () => {
    await render(<Basic />)
    await vi.waitFor(() => {
      const previous = document.querySelector('[data-part="action-trigger"][data-type="prev"]')
      const next = document.querySelector('[data-part="action-trigger"][data-type="next"]')
      expect(previous).toMatchTextContent('Prev')
      expect(previous).toBeDisabled()
      expect(next).toMatchTextContent('Next')
      expect(next).toBeDisabled()
    })
  })
})
