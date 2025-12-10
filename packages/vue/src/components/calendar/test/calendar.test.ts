import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import { getExports, getParts } from '../../../../../../utils/test'
import Basic from '../examples/Basic.vue'
import { Calendar, calendarAnatomy } from '../index'

describe('[calendar] component', () => {
  it.each(getParts(calendarAnatomy))('should render part %s', async (part) => {
    render(Basic)
    expect(document.querySelector(part)).toBeInTheDocument()
  })

  it.each(getExports(calendarAnatomy))('should export %s', async (part) => {
    expect(Calendar[part]).toBeDefined()
  })
})
