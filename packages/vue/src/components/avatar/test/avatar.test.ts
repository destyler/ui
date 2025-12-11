import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import { Avatar, avatarAnatomy } from '~/index'
import { getExports, getParts } from '../../../../../../utils/test'
import Basic from '../examples/Basic.vue'

describe('[avatar] component', () => {
  it.each(getParts(avatarAnatomy))('should render part %s', async (part) => {
    render(Basic)
    expect(document.querySelector(part)).toBeInTheDocument()
  })

  it.each(getExports(avatarAnatomy))('should export %s', async (part) => {
    expect(Avatar[part]).toBeDefined()
  })
})
