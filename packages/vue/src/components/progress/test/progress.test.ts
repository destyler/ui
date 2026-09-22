import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import { page, userEvent } from 'vitest/browser'
import { getExports, getParts } from '../../../../../../utils/test'
import Basic from '../examples/Basic.vue'
import CircularBasic from '../examples/circular/Basic.vue'
import CircularControlled from '../examples/circular/Controlled.vue'
import CircularMinMax from '../examples/circular/MinMax.vue'
import InitialValue from '../examples/InitialValue.vue'
import LinearBasic from '../examples/linear/Basic.vue'
import LinearControlled from '../examples/linear/Controlled.vue'
import LinearMinMax from '../examples/linear/MinMax.vue'
import { Progress, progressAnatomy } from '../index'
import ControlledWriteback from './ControlledWriteback.vue'

describe('[progress] component', () => {
  it.each(getParts(progressAnatomy))('should render part %s', async (part) => {
    render(Basic)
    expect(document.querySelector(part)).toBeInTheDocument()
  })

  it.each(getExports(progressAnatomy))('should export %s', async (part) => {
    expect(Progress[part]).toBeDefined()
  })

  it('seeds defaultValue when live value is omitted', async () => {
    render(InitialValue)
    await expect.element(page.getByText('70%')).toBeInTheDocument()
  })

  it('updates UI when parent controlled value changes', async () => {
    render(ControlledWriteback)
    await expect.element(page.getByText('42%')).toBeInTheDocument()
    await userEvent.click(page.getByRole('button', { name: 'parent-set-80' }))
    await expect.element(page.getByText('80%')).toBeInTheDocument()
  })

  it('writes parent state back through valueChange when api.setValue runs', async () => {
    render(ControlledWriteback)
    await expect.element(page.getByText('42%')).toBeInTheDocument()
    await userEvent.click(page.getByRole('button', { name: 'api-set-65' }))
    await expect.element(page.getByText('65%')).toBeInTheDocument()
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
