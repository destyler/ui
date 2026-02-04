import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { page } from 'vitest/browser'
import { getExports, getParts } from '../../../../../../utils/test'
import { Basic } from '../examples/Basic'
import { Events } from '../examples/Events'
import { RenderProp } from '../examples/RenderProp'
import { Splitter, splitterAnatomy } from '../index'

describe('[splitter] component', () => {
  it.each(getParts(splitterAnatomy))('should render part %s', async (part) => {
    render(<Basic />)
    expect(document.querySelector(part)).toBeInTheDocument()
  })

  it.each(getExports(splitterAnatomy))('should export %s', async (part) => {
    expect(Splitter[part]).toBeDefined()
  })

  describe('basic example', () => {
    it('should render with two panels and a resize trigger', async () => {
      render(<Basic />)
      await expect.element(page.getByText('A')).toBeVisible()
      await expect.element(page.getByText('B')).toBeVisible()
      // Check panels
      expect(document.querySelectorAll('[data-part="panel"]')).toHaveLength(2)
      // Check resize trigger
      expect(document.querySelector('[data-part="resize-trigger"]')).toBeInTheDocument()
    })
  })

  describe('events example', () => {
    it('should render with event handlers', async () => {
      render(<Events />)
      await expect.element(page.getByText('A')).toBeVisible()
      await expect.element(page.getByText('B')).toBeVisible()
      // Just check that the component renders, event testing requires more setup
    })
  })

  describe('renderProp example', () => {
    it('should render with context and buttons', async () => {
      render(<RenderProp />)
      await expect.element(page.getByText('Set A to 10%')).toBeVisible()
      await expect.element(page.getByText('Set B to 10%')).toBeVisible()
      // Check panels
      expect(document.querySelectorAll('[data-part="panel"]')).toHaveLength(2)
    })
  })
})
