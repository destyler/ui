import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-vue'
import { getExports, getParts } from '../../../../../../utils/test'
import Basic from '../examples/Basic.vue'
import { Tour, tourAnatomy } from '../index'

describe('[tour] component', () => {
  it.each(getParts(tourAnatomy))('should render part %s', async (part) => {
    render(Basic)
    await vi.waitFor(() => {
      expect(document.querySelector(part)).toBeInTheDocument()
    })
  })

  it.each(getExports(tourAnatomy))('should export %s', async (part) => {
    expect(Tour).toHaveProperty(part, expect.anything())
  })

  it('connects previous and next actions and disables them at the single-step boundaries', async () => {
    render(Basic)
    await vi.waitFor(() => {
      expect(document.querySelector('[data-part="action-trigger"][data-type="prev"]')).toBeDisabled()
      expect(document.querySelector('[data-part="action-trigger"][data-type="next"]')).toBeDisabled()
    })
  })
})
