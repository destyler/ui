import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { page } from 'vitest/browser'
import { getExports } from '../../../../../../utils/test'
import { Basic } from '../examples/Basic'
import { ScrollArea, scrollAreaAnatomy } from '../index'

describe('[scroll-area] component', () => {
  it.each(getExports(scrollAreaAnatomy))('should export %s', async (part) => {
    expect(ScrollArea[part]).toBeDefined()
  })

  describe('basic functionality', () => {
    it('should render content inside viewport', async () => {
      render(<Basic />)
      await expect.element(page.getByText('Tags')).toBeInTheDocument()
    })
  })
})
