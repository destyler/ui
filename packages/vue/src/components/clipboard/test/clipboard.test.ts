import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import { getExports, getParts } from '../../../../../../utils/test'
import Basic from '../examples/Basic.vue'
import { Clipboard, clipboardAnatomy } from '../index'

describe('[clipboard] component', () => {
  it.each(getParts(clipboardAnatomy))('should render part %s', async (part) => {
    render(Basic)
    expect(document.querySelector(part)).toBeInTheDocument()
  })

  it.each(getExports(clipboardAnatomy))('should export %s', async (part) => {
    render(Basic)
    expect(Clipboard[part]).toBeDefined()
  })
})
