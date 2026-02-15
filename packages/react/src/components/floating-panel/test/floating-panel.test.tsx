import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { getExports, getParts } from '../../../../../../utils/test'
import { Basic } from '../examples/Basic'
import { FloatingPanel, floatingPanelAnatomy } from '../index'

describe('[floating-panel] component', () => {
  it.each(getParts(floatingPanelAnatomy))('should render part %s', (part) => {
    render(<Basic />)
    expect(document.querySelector(part)).toBeInTheDocument()
  })

  it.each(getExports(floatingPanelAnatomy))('should export %s', (part) => {
    expect(FloatingPanel[part]).toBeDefined()
  })
})
