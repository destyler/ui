import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import { getExports, getParts } from '../../../../../../utils/test'
import Basic from '../examples/Basic.vue'
import { NavigationMenu, navigationMenuAnatomy } from '../index'

describe('[navigation-menu] component', () => {
  it.each(getParts(navigationMenuAnatomy))('should render part %s', async (part) => {
    render(Basic)
    expect(document.querySelector(part)).toBeInTheDocument()
  })

  it.each(getExports(navigationMenuAnatomy))('should export %s', async (part) => {
    expect(NavigationMenu[part]).toBeDefined()
  })
})
