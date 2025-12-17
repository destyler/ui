import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import { getExports, getParts } from '../../../../../../utils/test'
import Basic from '../examples/Basic.vue'
import { Tooltip, tooltipAnatomy } from '../index'

describe('[tooltip] component', () => {
  it.each(getParts(tooltipAnatomy))('should render part %s', async (part) => {
    render(Basic)
    expect(document.querySelector(part)).toBeInTheDocument()
  })

  it.each(getExports(tooltipAnatomy))('should export %s', async (part) => {
    expect(Tooltip[part]).toBeDefined()
  })
})
