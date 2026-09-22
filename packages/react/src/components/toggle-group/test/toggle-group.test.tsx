import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { page } from 'vitest/browser'
import { getExports, getParts } from '../../../../../../utils/test'
import { Basic } from '../examples/Basic'
import { InitialValue } from '../examples/InitialValue'
import { ToggleGroup, toggleGroupAnatomy } from '../index'

describe('[toggle-group] component', () => {
  it.each(getParts(toggleGroupAnatomy))('should render part %s', (part) => {
    render(<Basic />)
    expect(document.querySelector(part)).toBeInTheDocument()
  })

  it.each(getExports(toggleGroupAnatomy))('should export %s', (part) => {
    expect(ToggleGroup[part]).toBeDefined()
  })

  it('seeds default* via InitialValue example', async () => {
    render(<InitialValue />)
    const item = page.getByText('A', { exact: true })
    await expect.element(item).toHaveAttribute('data-state', 'on')
  })
})
