import { fireEvent, render, screen, waitFor } from '@solidjs/testing-library'
import { HoverCard, hoverCardAnatomy } from '../'
import { getExports, getParts } from '../../../setup-test'
import { ComponentUnderTest } from './basic'

const transitionTimeout = 5_000

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

    const target = screen.getByText('Hover me')
    fireEvent.pointerEnter(target, { pointerType: 'mouse' })

    const hoverContent = screen.getByText('Content')
    await waitFor(() => expect(hoverContent).toBeVisible(), { timeout: transitionTimeout })

    fireEvent.pointerLeave(target, { pointerType: 'mouse' })
    await waitFor(() => expect(hoverContent).not.toBeVisible(), { timeout: transitionTimeout })
  })

  it('should invoke onOpenChange', async () => {
    const onOpenChange = vi.fn()
    render(() => <ComponentUnderTest onOpenChange={onOpenChange} />)
    const target = screen.getByText('Hover me')
    fireEvent.pointerEnter(target, { pointerType: 'mouse' })

    await waitFor(
      () => expect(screen.getByText('Content')).toBeVisible(),
      { timeout: transitionTimeout },
    )
    expect(onOpenChange).toHaveBeenLastCalledWith({ open: true })

    fireEvent.pointerLeave(target, { pointerType: 'mouse' })
    await waitFor(
      () => expect(onOpenChange).toHaveBeenLastCalledWith({ open: false }),
      { timeout: transitionTimeout },
    )
  })

  it('should lazy mount', async () => {
    render(() => <ComponentUnderTest lazyMount />)
    expect(screen.queryByTestId('positioner')).not.toBeInTheDocument()

    const target = screen.getByText('Hover me')
    fireEvent.pointerEnter(target, { pointerType: 'mouse' })
    await waitFor(
      () => expect(screen.getByTestId('positioner')).toBeInTheDocument(),
      { timeout: transitionTimeout },
    )

    fireEvent.pointerLeave(target, { pointerType: 'mouse' })
    await waitFor(
      () => expect(screen.getByText('Content')).not.toBeVisible(),
      { timeout: transitionTimeout },
    )
    expect(screen.getByTestId('positioner')).toBeInTheDocument()
  })

  it('should lazy mount and unmount on exit', async () => {
    render(() => <ComponentUnderTest lazyMount unmountOnExit />)
    expect(screen.queryByTestId('positioner')).not.toBeInTheDocument()

    const target = screen.getByText('Hover me')
    fireEvent.pointerEnter(target, { pointerType: 'mouse' })
    await waitFor(
      () => expect(screen.getByTestId('positioner')).toBeInTheDocument(),
      { timeout: transitionTimeout },
    )

    fireEvent.pointerLeave(target, { pointerType: 'mouse' })
    await waitFor(
      () => expect(screen.queryByTestId('positioner')).not.toBeInTheDocument(),
      { timeout: transitionTimeout },
    )
  })
})
