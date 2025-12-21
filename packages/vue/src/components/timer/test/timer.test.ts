import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-vue'
import { getExports, getParts } from '../../../../../../utils/test'
import Basic from '../examples/Basic.vue'
import { Timer, timerAnatomy } from '../index'

// Parts that exist in anatomy but don't have corresponding API methods
const skippedParts = ['item-value', 'item-label']
const skippedExports = ['ItemValue', 'ItemLabel']

describe('[timer] component', () => {
  const parts = getParts(timerAnatomy).filter(
    part => !skippedParts.some(skip => part.includes(skip)),
  )

  it.each(parts)('should render part %s', async (part) => {
    render(Basic)
    await vi.waitFor(() => {
      expect(document.querySelector(part)).toBeInTheDocument()
    })
  })

  const exports = getExports(timerAnatomy).filter(
    exp => !skippedExports.includes(exp),
  )

  it.each(exports)('should export %s', async (part) => {
    expect(Timer[part]).toBeDefined()
  })
})
