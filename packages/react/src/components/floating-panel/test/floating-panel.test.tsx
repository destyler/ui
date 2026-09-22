import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { page } from 'vitest/browser'
import { getExports, getParts } from '../../../../../../utils/test'
import { Basic } from '../examples/Basic'
import { InitialOpen } from '../examples/InitialOpen'
import { FloatingPanel, floatingPanelAnatomy } from '../index'

describe('[floating-panel] component', () => {
  it.each(getParts(floatingPanelAnatomy))('should render part %s', (part) => {
    render(<Basic />)
    expect(document.querySelector(part)).toBeInTheDocument()
  })

  it.each(getExports(floatingPanelAnatomy))('should export %s', (part) => {
    expect(FloatingPanel[part]).toBeDefined()
  })

  it('seeds default* via InitialOpen example', async () => {
    render(<InitialOpen />)
    await expect.element(page.getByText('Initial Open Panel')).toBeVisible()
  })
})
