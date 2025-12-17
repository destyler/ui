import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import { getExports, getParts } from '../../../../../../utils/test'
import Basic from '../examples/Basic.vue'
import { ToggleGroup, toggleGroupAnatomy } from '../index'

describe.skip('[toggle-group] component', () => {
  it.each(getParts(toggleGroupAnatomy))('should render part %s', async (part) => {
    render(Basic)
    expect(document.querySelector(part)).toBeInTheDocument()
  })

  it.each(getExports(toggleGroupAnatomy))('should export %s', async (part) => {
    expect(ToggleGroup[part]).toBeDefined()
  })
})
