import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import { page } from 'vitest/browser'
import { getExports, getParts } from '../../../../../../utils/test'
import Basic from '../examples/Basic.vue'
import CircularBasic from '../examples/circular/Basic.vue'
import CircularControlled from '../examples/circular/Controlled.vue'
import CircularMinMax from '../examples/circular/MinMax.vue'
import LinearBasic from '../examples/linear/Basic.vue'
import LinearControlled from '../examples/linear/Controlled.vue'
import LinearMinMax from '../examples/linear/MinMax.vue'
import { Progress, progressAnatomy } from '../index'

describe('[progress] component', () => {
  it.each(getParts(progressAnatomy))('should render part %s', async (part) => {
    render(Basic)
    expect(document.querySelector(part)).toBeInTheDocument()
  })

  it.each(getExports(progressAnatomy))('should export %s', async (part) => {
    expect(Progress[part]).toBeDefined()
  })

  describe('circular progress', () => {
    it('should render circular basic progress with default value', async () => {
      render(CircularBasic)
      await expect.element(page.getByText('Label')).toBeInTheDocument()
      await expect.element(page.getByText('42%')).toBeInTheDocument()
    })

    it('should handle controlled circular progress', async () => {
      render(CircularControlled)
      await expect.element(page.getByText('42%')).toBeInTheDocument()
    })

    it('should handle min/max range in circular progress', async () => {
      render(CircularMinMax)
      await expect.element(page.getByText('Label')).toBeInTheDocument()
      // Value is 20, min is 10, max is 30, so percentage is (20-10)/(30-10) = 50%
      await expect.element(page.getByText('50%')).toBeInTheDocument()
    })
  })

  describe('linear progress', () => {
    it('should render linear basic progress with default value', async () => {
      render(LinearBasic)
      await expect.element(page.getByText('Label')).toBeInTheDocument()
      await expect.element(page.getByText('42%')).toBeInTheDocument()
    })

    it('should handle controlled linear progress', async () => {
      render(LinearControlled)
      await expect.element(page.getByText('42%')).toBeInTheDocument()
    })

    it('should handle min/max range in linear progress', async () => {
      render(LinearMinMax)
      await expect.element(page.getByText('Label')).toBeInTheDocument()
      // Value is 20, min is 10, max is 30, so percentage is (20-10)/(30-10) = 50%
      await expect.element(page.getByText('50%')).toBeInTheDocument()
    })
  })
})
