import { render, screen, waitFor } from '@solidjs/testing-library'
import { page, userEvent } from 'vitest/browser'
import { HoverCard, hoverCardAnatomy } from '../'
import { getExports, getParts } from '../../../setup-test'
import { ComponentUnderTest } from './basic'

const transitionTimeout = 5_000
const interactionTestTimeout = 60_000

async function hoverTrigger() {
  await movePointerOutside()
  const trigger = page.getByTestId('trigger')
  await userEvent.hover(trigger)
  expect(trigger.element().matches(':hover')).toBe(true)
}

async function movePointerOutside() {
  const outside = page.getByTestId('outside')
  await userEvent.hover(outside)
  expect(outside.element().matches(':hover')).toBe(true)
  expect(page.getByTestId('trigger').element().matches(':hover')).toBe(false)
  expect(
    document.querySelector('[data-scope="hover-card"][data-part="content"]')?.matches(':hover')
    ?? false,
  ).toBe(false)
}

describe('hoverCard', () => {
  it.each(getParts(hoverCardAnatomy))('should render part! %s', async (part) => {
    render(() => <ComponentUnderTest />)

    expect(document.querySelector(part)).toBeInTheDocument()
  })

  it.each(getExports(hoverCardAnatomy))('should export %s', async (part) => {
    expect(HoverCard[part]).toBeDefined()
  })

  it('should open on hover', async () => {
    render(() => <ComponentUnderTest />)

    await hoverTrigger()

    const hoverContent = screen.getByText('Content')
    await waitFor(() => expect(hoverContent).toBeVisible(), { timeout: transitionTimeout })

    await movePointerOutside()
    await waitFor(() => expect(hoverContent).not.toBeVisible(), { timeout: transitionTimeout })
  }, interactionTestTimeout)

  it('should invoke onOpenChange', async () => {
    const onOpenChange = vi.fn()
    render(() => <ComponentUnderTest onOpenChange={onOpenChange} />)
    await hoverTrigger()

    await waitFor(
      () => expect(screen.getByText('Content')).toBeVisible(),
      { timeout: transitionTimeout },
    )
    expect(onOpenChange).toHaveBeenLastCalledWith({ open: true })

    await movePointerOutside()
    await waitFor(
      () => expect(onOpenChange).toHaveBeenLastCalledWith({ open: false }),
      { timeout: transitionTimeout },
    )
  }, interactionTestTimeout)

  it('should lazy mount', async () => {
    render(() => <ComponentUnderTest lazyMount />)
    expect(screen.queryByTestId('positioner')).not.toBeInTheDocument()

    await hoverTrigger()
    await waitFor(
      () => expect(screen.getByTestId('positioner')).toBeInTheDocument(),
      { timeout: transitionTimeout },
    )

    await movePointerOutside()
    await waitFor(
      () => expect(screen.getByText('Content')).not.toBeVisible(),
      { timeout: transitionTimeout },
    )
    expect(screen.getByTestId('positioner')).toBeInTheDocument()
  }, interactionTestTimeout)

  it('should lazy mount and unmount on exit', async () => {
    render(() => <ComponentUnderTest lazyMount unmountOnExit />)
    expect(screen.queryByTestId('positioner')).not.toBeInTheDocument()

    await hoverTrigger()
    await waitFor(
      () => expect(screen.getByTestId('positioner')).toBeInTheDocument(),
      { timeout: transitionTimeout },
    )

    await movePointerOutside()
    await waitFor(
      () => expect(screen.queryByTestId('positioner')).not.toBeInTheDocument(),
      { timeout: transitionTimeout },
    )
  }, interactionTestTimeout)
})
