import { act } from 'react'
import { describe, expect, it, onTestFinished, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { page, userEvent } from 'vitest/browser'
import { getExports, getParts } from '../../../../../../utils/test'
import { Basic } from '../examples/Basic'
import { Controlled } from '../examples/Controlled'
import { InitialOpen } from '../examples/InitialOpen'
import { RootProvider } from '../examples/RootProvider'
import { HoverCard, hoverCardAnatomy, useHoverCard } from '../index'

describe('[hover-card] parts & exports', () => {
  it.each(getParts(hoverCardAnatomy))('should render part %s', async (part) => {
    render(<Basic />)
    expect(document.querySelector(part)).toBeInTheDocument()
  })

  it.each(getExports(hoverCardAnatomy))('should export %s', async (part) => {
    expect(HoverCard).toHaveProperty(part, expect.anything())
  })

  it('seeds default* via InitialOpen example', async () => {
    render(<InitialOpen />)
    await expect.element(page.getByText('Content')).toBeVisible()
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

  it('allows a later native pointer entry to reopen after an API close', async () => {
    const parking = document.createElement('div')
    Object.assign(parking.style, { position: 'fixed', right: '0px', bottom: '0px', width: '8px', height: '8px' })
    document.body.append(parking)
    onTestFinished(() => parking.remove())
    await userEvent.hover(parking)
    const onOpenChange = vi.fn()
    let api!: ReturnType<typeof useHoverCard>
    function Fixture() {
      'use no memo'
      api = useHoverCard({ openDelay: 0, closeDelay: 0, onOpenChange })
      return (
        <HoverCard.RootProvider value={api}>
          <HoverCard.Trigger>Pointer lifecycle trigger</HoverCard.Trigger>
          <HoverCard.Positioner>
            <HoverCard.Content>Pointer lifecycle content</HoverCard.Content>
          </HoverCard.Positioner>
        </HoverCard.RootProvider>
      )
    }
    await render(<Fixture />)
    const trigger = page.getByText('Pointer lifecycle trigger')
    const content = page.getByText('Pointer lifecycle content')

    for (let cycle = 0; cycle < 2; cycle++) {
      await act(async () => api.setOpen(true))
      await expect.element(content).toBeVisible()
      await act(async () => api.setOpen(false))
      await expect.element(content).not.toBeVisible()
      await userEvent.hover(trigger)
      await expect.element(content).toBeVisible()
      await userEvent.hover(parking)
      await expect.element(content).not.toBeVisible()
    }
    expect(onOpenChange.mock.calls.map(([details]) => details.open)).toEqual([
      true,
      false,
      true,
      false,
      true,
      false,
      true,
      false,
    ])
  })

  it('should work in controlled mode', async () => {
    render(<Controlled />)

    const toggleButton = page.getByRole('button', { name: 'Open HoverCard' })

    await expect.element(page.getByText('Content')).not.toBeVisible()

    await userEvent.click(toggleButton)
    await expect.element(page.getByText('Content')).toBeVisible()

    await userEvent.keyboard('{Escape}')
    await expect.element(page.getByText('Content')).not.toBeVisible()

    const trigger = page.getByText('Hover me')
    await userEvent.hover(trigger)
    await expect.element(page.getByText('Content')).toBeVisible()
    await userEvent.unhover(trigger)
    await expect.element(page.getByText('Content')).not.toBeVisible()

    await userEvent.click(toggleButton)
    await expect.element(page.getByText('Content')).toBeVisible()
    await userEvent.keyboard('{Escape}')
    await expect.element(page.getByText('Content')).not.toBeVisible()
  })

  it('should open via api', async () => {
    render(<RootProvider />)

    const openButton = page.getByRole('button', { name: 'Open' })
    await userEvent.click(openButton)

    await expect.element(page.getByText('Content')).toBeVisible()
  })
})
