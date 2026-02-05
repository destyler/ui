import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { page, userEvent } from 'vitest/browser'
import { getExports, getParts } from '../../../../../../utils/test'
import { Basic } from '../examples/Basic'
import { Controlled } from '../examples/Controlled'
import { RootProvider } from '../examples/RootProvider'
import { HoverCard, hoverCardAnatomy } from '../index'

describe('[hover-card] parts & exports', () => {
  it.each(getParts(hoverCardAnatomy))('should render part %s', async (part) => {
    render(<Basic />)
    expect(document.querySelector(part)).toBeInTheDocument()
  })

  it.each(getExports(hoverCardAnatomy))('should export %s', async (part) => {
    expect(HoverCard[part]).toBeDefined()
  })
})

describe('[hover-card] functionality', () => {
  it('should open on hover', async () => {
    render(<Basic />)

    const target = page.getByText('Hover me')
    await userEvent.hover(target)

    const hoverContent = page.getByText('Content')
    await expect.element(hoverContent).toBeVisible()

    await userEvent.unhover(target)
    await expect.element(hoverContent).not.toBeVisible()
  })

  it('should work in controlled mode', async () => {
    render(<Controlled />)

    const toggleButton = page.getByRole('button', { name: 'Open HoverCard' })

    await expect.element(page.getByText('Content')).not.toBeVisible()

    await userEvent.click(toggleButton)
    await expect.element(page.getByText('Content')).toBeVisible()
  })

  it('should open via api', async () => {
    render(<RootProvider />)

    const openButton = page.getByRole('button', { name: 'Open' })
    await userEvent.click(openButton)

    await expect.element(page.getByText('Content')).toBeVisible()
  })
})
