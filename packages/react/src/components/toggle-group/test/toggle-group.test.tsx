import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { getExports, getParts } from '../../../../../../utils/test'
import { Basic } from '../examples/Basic'
import { ToggleGroup, toggleGroupAnatomy } from '../index'

describe('[toggle-group] component', () => {
  it.each(getParts(toggleGroupAnatomy))('should render part %s', (part) => {
    render(<Basic />)
    expect(document.querySelector(part)).toBeInTheDocument()
  })

  it.each(getExports(toggleGroupAnatomy))('should export %s', (part) => {
    expect(ToggleGroup[part]).toBeDefined()
  })
})
