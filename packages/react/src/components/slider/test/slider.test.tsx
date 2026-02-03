import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { page } from 'vitest/browser'
import { getExports, getParts } from '../../../../../../utils/test'
import { Basic } from '../examples/Basic'
import { InitialValue } from '../examples/InitialValue'
import { MinMax } from '../examples/MinMax'
import { OnEvent } from '../examples/OnEvent'
import { Range } from '../examples/Range'
import { Step } from '../examples/Step'
import { Vertical } from '../examples/Vertical'
import { WithMarks } from '../examples/WithMarks'
import { Slider, sliderAnatomy } from '../index'

describe('[slider] component', () => {
  it.each(getParts(sliderAnatomy))('should render part %s', (part) => {
    render(<Basic />)
    expect(document.querySelector(part)).toBeInTheDocument()
  })

  it.each(getExports(sliderAnatomy))('should export %s', (part) => {
    expect(Slider[part]).toBeDefined()
  })
})

describe('basic example', () => {
  it('should render with v-model and markers', async () => {
    render(<Basic />)
    await expect.element(page.getByText('Slider Label')).toBeVisible()
    await expect.element(page.getByText('-20, 20')).toBeVisible()
    expect(document.querySelectorAll('[data-part="marker"]')).toHaveLength(3)
  })
})

describe('range example', () => {
  it('should render with two thumbs', async () => {
    render(<Range />)
    await expect.element(page.getByText('Range Slider')).toBeVisible()
    expect(document.querySelectorAll('[data-part="thumb"]')).toHaveLength(2)
  })
})

describe('vertical example', () => {
  it('should render vertically', async () => {
    render(<Vertical />)
    await expect.element(page.getByText('Vertical Slider')).toBeVisible()
    const control = document.querySelector('[data-part="control"]')
    expect(control).toHaveAttribute('data-orientation', 'vertical')
  })
})

describe('onEvent example', () => {
  it('should render with event handlers', async () => {
    render(<OnEvent />)
    await expect.element(page.getByText('Event Handling')).toBeVisible()
  })
})

describe('initialValue example', () => {
  it('should render with initial value', async () => {
    render(<InitialValue />)
    await expect.element(page.getByText('Slider with Initial Value')).toBeVisible()
    await expect.element(page.getByText('42')).toBeVisible()
  })
})

describe('minMax example', () => {
  it('should render with min and max props', async () => {
    render(<MinMax />)
    await expect.element(page.getByText('Min/Max (-10 to 10)')).toBeVisible()
  })
})

describe('step example', () => {
  it('should render with step prop', async () => {
    render(<Step />)
    await expect.element(page.getByText('Step (0.01)')).toBeVisible()
  })
})

describe('withMarks example', () => {
  it('should render with markers', async () => {
    render(<WithMarks />)
    await expect.element(page.getByText('With Marks')).toBeVisible()
    expect(document.querySelectorAll('[data-part="marker"]')).toHaveLength(4)
  })
})
