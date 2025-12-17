import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import { getExports, getParts } from '../../../../../../utils/test'
import Basic from '../examples/Basic.vue'
import { Tour, tourAnatomy } from '../index'

describe.skip('[tour] component', () => {
  it.each(getParts(tourAnatomy))('should render part %s', async (part) => {
    render(Basic)
    expect(document.querySelector(part)).toBeInTheDocument()
  })

  it.each(getExports(tourAnatomy))('should export %s', async (part) => {
    expect(Tour[part]).toBeDefined()
  })
})
