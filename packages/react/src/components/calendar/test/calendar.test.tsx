import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { page, userEvent } from 'vitest/browser'
import { getExports, getParts } from '../../../../../../utils/test'
import { Basic } from '../examples/Basic'
import { InitialValue } from '../examples/InitialValue'
import { Calendar, calendarAnatomy } from '../index'

describe('[calendar] component', () => {
  it.each(getParts(calendarAnatomy))('should render part %s', async (part) => {
    render(<Basic />)
    expect(document.querySelector(part)).toBeInTheDocument()
  })

  it.each(getExports(calendarAnatomy))('should export %s', async (part) => {
    expect(Calendar[part]).toBeDefined()
  })

  it('should be able to lazy mount', async () => {
    render(<Basic lazyMount />)

    await expect.element(page.getByTestId('positioner')).not.toBeInTheDocument()

    await userEvent.click(page.getByRole('button', { name: 'Open calendar' }))
    await expect.element(page.getByTestId('positioner')).toBeInTheDocument()

    await userEvent.click(page.getByRole('button', { name: 'Close calendar' }))
    await expect.element(page.getByTestId('positioner')).toBeInTheDocument()
  })

  it('seeds default* via InitialValue example', async () => {
    render(<InitialValue />)
    const input = document.querySelector('[data-scope="date-picker"][data-part="input"], [data-scope="calendar"][data-part="input"], input') as HTMLInputElement | null
    expect(input).toBeTruthy()
    expect(input!.value.length).toBeGreaterThan(0)
  })
})
