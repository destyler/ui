import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import { getExports, getParts } from '../../../../../../utils/test'
import Basic from '../examples/Basic.vue'
import InitialValue from '../examples/InitialValue.vue'
import { Toggle, toggleAnatomy } from '../index'

describe('[toggle] component', () => {
  it.each(getParts(toggleAnatomy))('should render part %s', async (part) => {
    render(Basic)
    expect(document.querySelector(part)).toBeInTheDocument()
  })

  it.each(getExports(toggleAnatomy))('should export %s', async (part) => {
    expect(Toggle[part]).toBeDefined()
  })

  it('seeds default* via InitialValue example', async () => {
    render(InitialValue)
    const root = document.querySelector('[data-scope="toggle"][data-part="root"]')
    expect(root).toHaveAttribute('data-state', 'on')
  })
})
