import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { page } from 'vitest/browser'
import { getExports, getParts } from '../../../../../../utils/test'
import { Basic } from '../examples/Basic'
import { Basic as CircularBasic } from '../examples/circular/Basic'
import { Controlled as CircularControlled } from '../examples/circular/Controlled'
import { MinMax as CircularMinMax } from '../examples/circular/MinMax'
import { Basic as LinearBasic } from '../examples/linear/Basic'
import { Controlled as LinearControlled } from '../examples/linear/Controlled'
import { MinMax as LinearMinMax } from '../examples/linear/MinMax'
import { Progress, progressAnatomy } from '../index'

describe('[progress] component', () => {
  it.each(getParts(progressAnatomy).filter(p => !p.includes('view')))('should render part %s', async (part) => {
    render(<Basic />)
    expect(document.querySelector(part)).toBeInTheDocument()
  })

  it.each(getExports(progressAnatomy))('should export %s', (part) => {
    expect(Progress[part]).toBeDefined()
  })

  describe('circular progress', () => {
    it('should render circular basic progress with default value', async () => {
      render(<CircularBasic />)
      await expect.element(page.getByText('Label')).toBeInTheDocument()
      await expect.element(page.getByText('42%')).toBeInTheDocument()
    })

    it('should handle controlled circular progress', async () => {
      render(<CircularControlled />)
      await expect.element(page.getByText('42%')).toBeInTheDocument()
    })

    it('should handle min/max range in circular progress', async () => {
      render(<CircularMinMax />)
      await expect.element(page.getByText('Label')).toBeInTheDocument()
      // Value is 20, min is 10, max is 30, so percentage is (20-10)/(30-10) = 50%
      await expect.element(page.getByText('50%')).toBeInTheDocument()
    })
  })

  describe('linear progress', () => {
    it('should render linear basic progress with default value', async () => {
      render(<LinearBasic />)
      await expect.element(page.getByText('Label')).toBeInTheDocument()
      await expect.element(page.getByText('42%')).toBeInTheDocument()
    })

    it('should handle controlled linear progress', async () => {
      render(<LinearControlled />)
      await expect.element(page.getByText('42%')).toBeInTheDocument()
    })

    it('should handle min/max range in linear progress', async () => {
      render(<LinearMinMax />)
      await expect.element(page.getByText('Label')).toBeInTheDocument()
      // Value is 20, min is 10, max is 30, so percentage is (20-10)/(30-10) = 50%
      await expect.element(page.getByText('50%')).toBeInTheDocument()
    })
  })
})
