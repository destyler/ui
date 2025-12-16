import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import { page } from 'vitest/browser'
import { getExports, getParts } from '../../../../../../utils/test'
import Basic from '../examples/Basic.vue'
import InitialValue from '../examples/InitialValue.vue'
import MinMax from '../examples/MinMax.vue'
import OnEvent from '../examples/OnEvent.vue'
import Range from '../examples/Range.vue'
import Step from '../examples/Step.vue'
import Vertical from '../examples/Vertical.vue'
import WithMarks from '../examples/WithMarks.vue'
import { Slider, sliderAnatomy } from '../index'

describe('[slider] component', () => {
  it.each(getParts(sliderAnatomy))('should render part %s', async (part) => {
    render(Basic)
    expect(document.querySelector(part)).toBeInTheDocument()
  })

  it.each(getExports(sliderAnatomy))('should export %s', async (part) => {
    expect(Slider[part]).toBeDefined()
  })

  describe('basic example', () => {
    it('should render with v-model and markers', async () => {
      render(Basic)
      await expect.element(page.getByText('Quantity:')).toBeVisible()
      await expect.element(page.getByText('-20, 20')).toBeVisible() // assuming ValueText shows the value
      // Check markers
      expect(document.querySelectorAll('[data-part="marker"]')).toHaveLength(3)
    })
  })

  describe('range example', () => {
    it('should render with two thumbs', async () => {
      render(Range)
      await expect.element(page.getByText('Label')).toBeVisible()
      // Check two thumbs
      expect(document.querySelectorAll('[data-part="thumb"]')).toHaveLength(2)
    })
  })

  describe('vertical example', () => {
    it('should render vertically', async () => {
      render(Vertical)
      await expect.element(page.getByText('Label')).toBeVisible()
      // Check orientation attribute or class
      const control = document.querySelector('[data-part="control"]')
      expect(control).toHaveAttribute('data-orientation', 'vertical')
    })
  })

  describe('onEvent example', () => {
    it('should render with event handlers', async () => {
      render(OnEvent)
      await expect.element(page.getByText('Label')).toBeVisible()
      // Just check that the component renders, event testing requires more setup
    })
  })

  describe('initialValue example', () => {
    it('should render with initial value', async () => {
      render(InitialValue)
      await expect.element(page.getByText('Label')).toBeVisible()
      await expect.element(page.getByText('42')).toBeVisible()
    })
  })

  describe('minMax example', () => {
    it('should render with min and max props', async () => {
      render(MinMax)
      await expect.element(page.getByText('Label')).toBeVisible()
      // Min and max are internal props, check that component renders
    })
  })

  describe('step example', () => {
    it('should render with step prop', async () => {
      render(Step)
      await expect.element(page.getByText('Label')).toBeVisible()
      // Step is internal prop, check that component renders
    })
  })

  describe('withMarks example', () => {
    it('should render with markers', async () => {
      render(WithMarks)
      await expect.element(page.getByText('Label')).toBeVisible()
      // Check markers
      expect(document.querySelectorAll('[data-part="marker"]')).toHaveLength(4)
    })
  })
})
