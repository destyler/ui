import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import { getExports, getParts } from '../../../../../../utils/test'
import Basic from '../examples/Basic.vue'
import { Toggle, toggleAnatomy } from '../index'

describe.skip('[toggle] component', () => {
  it.each(getParts(toggleAnatomy))('should render part %s', async (part) => {
    render(Basic)
    expect(document.querySelector(part)).toBeInTheDocument()
  })

  it.each(getExports(toggleAnatomy))('should export %s', async (part) => {
    expect(Toggle[part]).toBeDefined()
  })
})
