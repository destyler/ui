import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import { getExports, getParts } from '../../../../../../utils/test'
import Basic from '../examples/Basic.vue'
import InitialValue from '../examples/InitialValue.vue'
import { Tree, treeAnatomy } from '../index'

describe('[tree] component', () => {
  it.each(getParts(treeAnatomy))('should render part %s', async (part) => {
    render(Basic)
    expect(document.querySelector(part)).toBeInTheDocument()
  })

  it.each(getExports(treeAnatomy))('should export %s', async (part) => {
    expect(Tree[part]).toBeDefined()
  })

  it('seeds default* via InitialValue example', async () => {
    render(InitialValue)
    const src = document.querySelector('[data-part="branch"][data-value="src"]')!
    const modules = document.querySelector('[data-part="branch"][data-value="node_modules"]')!
    expect(src).toHaveAttribute('aria-selected', 'true')
    expect(src).toHaveAttribute('aria-expanded', 'true')
    expect(modules).toHaveAttribute('aria-selected', 'false')
    expect(modules).toHaveAttribute('aria-expanded', 'true')
    expect(document.querySelector('[data-part="item"][data-value="src/app.tsx"]')).toBeVisible()
  })
})
