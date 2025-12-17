import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import { getExports, getParts } from '../../../../../../utils/test'
import Basic from '../examples/Basic.vue'
import { Tree, treeAnatomy } from '../index'

describe('[tree] component', () => {
  it.each(getParts(treeAnatomy))('should render part %s', async (part) => {
    render(Basic)
    expect(document.querySelector(part)).toBeInTheDocument()
  })

  it.each(getExports(treeAnatomy))('should export %s', async (part) => {
    expect(Tree[part]).toBeDefined()
  })
})
