import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { getExports, getParts } from '../../../../../../utils/test'
import { Basic } from '../examples/Basic'
import { Clipboard, clipboardAnatomy } from '../index'

describe('[clipboard] component', () => {
  it.each(getParts(clipboardAnatomy))('should render part %s', (part) => {
    render(<Basic />)
    expect(document.querySelector(part)).toBeInTheDocument()
  })

  it.each(getExports(clipboardAnatomy))('should export %s', (part) => {
    render(<Basic />)
    expect(Clipboard[part]).toBeDefined()
  })
})
