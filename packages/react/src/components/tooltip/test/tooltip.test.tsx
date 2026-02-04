import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { page, userEvent } from 'vitest/browser'
import { getExports, getParts } from '../../../../../../utils/test'
import { Basic } from '../examples/Basic'
import { Controlled } from '../examples/Controlled'
import { RootProvider } from '../examples/RootProvider'
import { Timings } from '../examples/Timings'
import { Tooltip, tooltipAnatomy } from '../index'

describe('[tooltip] parts & exports', () => {
  it.each(getParts(tooltipAnatomy))('should render part %s', async (part) => {
    render(<Basic />)
    expect(document.querySelector(part)).toBeInTheDocument()
  })

  it.each(getExports(tooltipAnatomy))('should export %s', async (part) => {
    expect(Tooltip[part]).toBeDefined()
  })
})

describe('[tooltip] functionality', () => {
  it('should open on trigger hover', async () => {
    render(<Timings />)

    const trigger = page.getByRole('button', { name: 'Hover Me' })
    await userEvent.hover(trigger)

    await expect.element(page.getByText('I am a tooltip!')).toBeVisible()
  })

  it('should work in controlled mode', async () => {
    render(<Controlled />)

    const toggleButton = page.getByRole('button', { name: 'Toggle' })

    await expect.element(page.getByText('I am a tooltip!')).not.toBeVisible()

    await userEvent.click(toggleButton)
    await expect.element(page.getByText('I am a tooltip!')).toBeVisible()
  })

  it('should open via api', async () => {
    render(<RootProvider />)

    const openButton = page.getByRole('button', { name: 'Open' })
    await userEvent.click(openButton)

    await expect.element(page.getByText('I am a tooltip!')).toBeVisible()
  })
})
