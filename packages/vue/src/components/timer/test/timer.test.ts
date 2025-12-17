import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import { getExports, getParts } from '../../../../../../utils/test'
import Basic from '../examples/Basic.vue'
import { Timer, timerAnatomy } from '../index'

describe.skip('[timer] component', () => {
  it.each(getParts(timerAnatomy))('should render part %s', async (part) => {
    render(Basic)
    expect(document.querySelector(part)).toBeInTheDocument()
  })

  it.each(getExports(timerAnatomy))('should export %s', async (part) => {
    expect(Timer[part]).toBeDefined()
  })
})
