import { fireEvent, render, screen, waitFor } from '@solidjs/testing-library'
import user from '@testing-library/user-event'
import { FloatingPanel, floatingPanelAnatomy } from '../'
import { getExports, getParts } from '../../../setup-test'
import { Controlled } from '../examples/Controlled'
import { DefaultOpen } from '../examples/DefaultOpen'
import { RootProvider } from '../examples/RootProvider'
import { WithContext } from '../examples/WithContext'
import { ComponentUnderTest } from './basic'

describe('floating panel', () => {
  it.each(getParts(floatingPanelAnatomy))('should render part %s', (part) => {
    render(() => <ComponentUnderTest />)

    expect(document.querySelector(part)).toBeInTheDocument()
  })

  it.each(getExports(floatingPanelAnatomy))('should export %s', (part) => {
    expect(FloatingPanel[part]).toBeDefined()
  })

  it('should open and close the panel', async () => {
    render(() => <ComponentUnderTest />)

    expect(screen.getByText('Floating Panel')).not.toBeVisible()
    await user.click(screen.getByRole('button', { name: 'Toggle Panel' }))
    expect(screen.getByText('Floating Panel')).toBeVisible()

    await user.click(screen.getByRole('button', { name: /close/i }))
    await waitFor(() => expect(screen.getByText('Floating Panel')).not.toBeVisible())
  })

  it('should render with the default open state', () => {
    render(() => <DefaultOpen />)

    expect(screen.getByText('Default Open Panel')).toBeVisible()
  })

  it('should synchronize a controlled open state', async () => {
    render(() => <Controlled />)

    expect(screen.getByText('Controlled Panel')).not.toBeVisible()
    await user.click(screen.getByRole('button', { name: /external toggle/i }))
    await waitFor(() => expect(screen.getByText('Controlled Panel')).toBeVisible())
    expect(screen.getByText('Open state: true')).toBeVisible()

    await user.click(screen.getByRole('button', { name: /external toggle/i }))
    await waitFor(() => expect(screen.getByText('Controlled Panel')).not.toBeVisible())
  })

  it('keeps rejected controlled close requests open without duplicate callbacks', () => {
    const onOpenChange = vi.fn()
    render(() => <ComponentUnderTest open onOpenChange={onOpenChange} />)

    const panel = screen.getByText('Floating Panel')
    const content = panel.closest<HTMLElement>('[data-part="content"]')!
    expect(panel).toBeVisible()

    fireEvent.click(screen.getByRole('button', { name: /close/i }))

    expect(onOpenChange).toHaveBeenCalledOnce()
    expect(onOpenChange).toHaveBeenCalledWith({ open: false })
    expect(panel).toBeVisible()
    expect(content).toHaveAttribute('data-state', 'open')
  })

  it('should expose reactive context state', async () => {
    render(() => <WithContext />)

    expect(screen.getByText('Open: false')).not.toBeVisible()
    await user.click(screen.getByRole('button', { name: 'Toggle Panel' }))
    await waitFor(() => expect(screen.getByText('Open: true')).toBeVisible())
  })

  it('should support RootProvider', async () => {
    render(() => <RootProvider />)

    await user.click(screen.getByRole('button', { name: 'Toggle Panel' }))
    expect(screen.getByText('Root Provider Panel')).toBeVisible()
  })

  it('should render all resize handles with their axes', () => {
    const { container } = render(() => <ComponentUnderTest defaultOpen />)
    const handles = container.querySelectorAll(
      '[data-scope="floating-panel"][data-part="resize-trigger"]',
    )

    expect(handles).toHaveLength(8)
    expect(Array.from(handles, handle => handle.getAttribute('data-axis'))).toEqual([
      'n',
      'e',
      'w',
      's',
      'ne',
      'se',
      'sw',
      'nw',
    ])
  })

  it('should lazy mount without a stale aria-controls reference', async () => {
    render(() => <ComponentUnderTest lazyMount />)

    const trigger = screen.getByRole('button', { name: 'Toggle Panel' })
    expect(trigger).not.toHaveAttribute('aria-controls')
    expect(screen.queryByTestId('positioner')).not.toBeInTheDocument()

    await user.click(trigger)
    expect(screen.getByTestId('positioner')).toBeInTheDocument()
    expect(trigger).toHaveAttribute('aria-controls')
  })
})
