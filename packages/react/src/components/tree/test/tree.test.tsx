import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { getExports, getParts } from '../../../../../../utils/test'
import { Basic } from '../examples/Basic'
import { Tree, treeAnatomy } from '../index'

describe('[tree] component', () => {
  it.each(getParts(treeAnatomy))('should render part %s', (part) => {
    render(<Basic />)
    expect(document.querySelector(part)).toBeInTheDocument()
  })

  it.each(getExports(treeAnatomy))('should export %s', (part) => {
    expect(Tree[part]).toBeDefined()
  })
})
