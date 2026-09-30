import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { page, userEvent } from 'vitest/browser'
import { getExports, getParts } from '../../../../../../utils/test'
import { Basic } from '../examples/Basic'
import { Controlled } from '../examples/Controlled'
import { InitialValue } from '../examples/InitialValue'
import { ToggleGroup, toggleGroupAnatomy } from '../index'

describe('[toggle-group] component', () => {
  it.each(getParts(toggleGroupAnatomy))('should render part %s', (part) => {
    render(<Basic />)
    expect(document.querySelector(part)).toBeInTheDocument()
  })

  it.each(getExports(toggleGroupAnatomy))('should export %s', (part) => {
    expect(ToggleGroup).toHaveProperty(part, expect.anything())
  })

  it('seeds default* via InitialValue example', async () => {
    render(<InitialValue />)
    const item = page.getByText('A', { exact: true })
    await expect.element(item).toHaveAttribute('data-state', 'on')
  })

  it('keeps the controlled array value in sync across selection and deselection', async () => {
    render(<Controlled />)
    const a = page.getByRole('radio', { name: 'A', exact: true })
    const b = page.getByRole('radio', { name: 'B', exact: true })
    const c = page.getByRole('radio', { name: 'C', exact: true })
    await expect.element(a).toHaveAttribute('aria-checked', 'true')

    await userEvent.click(b)
    await expect.element(a).toHaveAttribute('data-state', 'off')
    await expect.element(b).toHaveAttribute('data-state', 'on')
    await expect.element(b).toHaveAttribute('aria-checked', 'true')

    await userEvent.click(c)
    await expect.element(b).toHaveAttribute('data-state', 'off')
    await expect.element(c).toHaveAttribute('aria-checked', 'true')
    await userEvent.click(c)
    await expect.element(c).toHaveAttribute('data-state', 'off')
    await expect.element(c).toHaveAttribute('aria-checked', 'false')
    await userEvent.click(a)
    await expect.element(a).toHaveAttribute('data-state', 'on')
  })
})
