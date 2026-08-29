import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-svelte'
import { userEvent } from 'vitest/browser'
import Basic from '../examples/Basic.svelte'
import CenterOrigin from '../examples/CenterOrigin.svelte'
import DraggingIndicator from '../examples/DraggingIndicator.svelte'
import InitialValue from '../examples/InitialValue.svelte'
import MinMax from '../examples/MinMax.svelte'
import OnEvent from '../examples/OnEvent.svelte'
import Range from '../examples/Range.svelte'
import RootProvider from '../examples/RootProvider.svelte'
import Step from '../examples/Step.svelte'
import Vertical from '../examples/Vertical.svelte'
import WithMarks from '../examples/WithMarks.svelte'
import { Slider, sliderAnatomy } from '../index'

const componentExports = Slider as unknown as Record<string, unknown>

describe('[slider] component', () => {
  it.each(sliderAnatomy.keys())('renders part %s', async (part) => {
    await render(Basic)
    const dataPart = part.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)
    expect(document.querySelector(`[data-scope="slider"][data-part="${dataPart}"]`)).not.toBeNull()
  })

  it.each(sliderAnatomy.keys())('exports %s', (part) => {
    const exportName = `${part.charAt(0).toUpperCase()}${part.slice(1)}`
    expect(componentExports[exportName], `Slider.${exportName}`).toBeDefined()
  })

  it('renders a controlled range with markers', async () => {
    const screen = await render(Basic)
    await expect.element(screen.getByText('Slider Label')).toBeVisible()
    await expect.element(screen.getByText('-20, 20')).toBeVisible()
    expect(document.querySelectorAll('[data-scope="slider"][data-part="marker"]')).toHaveLength(3)
    expect(document.querySelectorAll('[data-scope="slider"][data-part="thumb"]')).toHaveLength(2)
  })

  it('changes its value with keyboard interaction', async () => {
    const onValueChange = vi.fn()
    const screen = await render(Basic, { props: { onValueChange } })
    const firstThumb = screen.getByRole('slider').first()
    firstThumb.element().focus()
    await userEvent.keyboard('{ArrowRight}')
    await expect.element(screen.getByText('-19, 20')).toBeVisible()
    expect(onValueChange).toHaveBeenCalled()
  })

  it('supports center-origin and dragging-indicator examples', async () => {
    const center = await render(CenterOrigin)
    await expect.element(center.getByText('Center Origin')).toBeVisible()

    const dragging = await render(DraggingIndicator)
    await expect.element(dragging.getByText('Dragging Indicator')).toBeVisible()
    await expect.element(document.querySelector<HTMLElement>('[data-part="dragging-indicator"]')!).toHaveAttribute('data-state', 'closed')
  })

  it('renders an initial value', async () => {
    const screen = await render(InitialValue)
    await expect.element(screen.getByText('Slider with Initial Value')).toBeVisible()
    await expect.element(screen.getByText('42')).toBeVisible()
  })

  it('supports min and max values', async () => {
    const minMax = await render(MinMax)
    await expect.element(minMax.getByText('Min/Max (-10 to 10)')).toBeVisible()
    await expect.element(minMax.getByRole('slider')).toHaveAttribute('aria-valuemin', '-10')
    await expect.element(minMax.getByRole('slider')).toHaveAttribute('aria-valuemax', '10')
  })

  it('supports fractional step values', async () => {
    const step = await render(Step)
    await expect.element(step.getByText('Step (0.01)')).toBeVisible()
    step.getByRole('slider').element().focus()
    await userEvent.keyboard('{ArrowRight}')
    await expect.element(step.getByText('7.01')).toBeVisible()
  })

  it('reports value-change events', async () => {
    const onValueChange = vi.fn()
    const screen = await render(OnEvent, { props: { onValueChange } })
    screen.getByRole('slider').element().focus()
    await userEvent.keyboard('{ArrowRight}')
    expect(onValueChange).toHaveBeenCalled()
  })

  it('renders a range variant', async () => {
    const range = await render(Range)
    await expect.element(range.getByText('Range Slider')).toBeVisible()
    expect(document.querySelectorAll('[data-part="thumb"]')).toHaveLength(2)
  })

  it('renders a vertical variant', async () => {
    const vertical = await render(Vertical)
    await expect.element(vertical.getByText('Vertical Slider')).toBeVisible()
    await expect.element(document.querySelector<HTMLElement>('[data-part="control"]')!).toHaveAttribute('data-orientation', 'vertical')
  })

  it('focuses the slider through RootProvider', async () => {
    const screen = await render(RootProvider)
    const button = screen.getByRole('button', { name: 'Focus Slider' })
    expect(screen.container.firstElementChild?.tagName).toBe('DIV')
    expect((button.element() as HTMLButtonElement).style.marginBottom).toBe('16px')
    await button.click()
    await expect.element(screen.getByRole('slider')).toHaveFocus()
  })

  it('renders four custom marks', async () => {
    const screen = await render(WithMarks)
    await expect.element(screen.getByText('With Marks')).toBeVisible()
    expect(document.querySelectorAll('[data-part="marker"]')).toHaveLength(4)
  })
})
