import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { getExports, getParts } from '../../../../../../utils/test'
import { Basic } from '../examples/Basic'
import { Avatar, avatarAnatomy } from '../index'

describe('[avatar] parts & exports', () => {
  it.each(getParts(avatarAnatomy))('should render part %s', (part) => {
    render(<Basic />)
    expect(document.querySelector(part)).toBeInTheDocument()
  })

  it.each(getExports(avatarAnatomy))('should export %s', (part) => {
    render(<Basic />)
    expect(Avatar[part]).toBeDefined()
  })
})
