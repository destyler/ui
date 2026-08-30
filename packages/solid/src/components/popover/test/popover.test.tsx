import { render, screen, waitFor } from '@solidjs/testing-library'
import user from '@testing-library/user-event'
import { createSignal } from 'solid-js'
import { Popover, popoverAnatomy, usePopover } from '../'
import { getExports, getParts } from '../../../setup-test'
import { ComponentUnderTest } from './basic'
import { ControlledComponentUnderTest } from './controlled'

describe('popover', () => {
  it.each(getParts(popoverAnatomy))('should render part! %s', async (part) => {
    render(() => <ComponentUnderTest />)

    expect(document.querySelector(part)).toBeInTheDocument()
  })

  it.each(getExports(popoverAnatomy))('should export %s', async (part) => {
    expect(Popover[part]).toBeDefined()
  })

  it('should open and close the popover', async () => {
    render(() => <ComponentUnderTest />)

    await user.click(screen.getByText('click me'))
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    await user.click(screen.getByText('close'))
    await waitFor(() => expect(screen.queryByText('title')).not.toBeVisible())
  })

  it.skip('should hide the popover when escape is pressed', async () => {
    render(() => <ComponentUnderTest />)

    await user.click(screen.getByText('click me'))
    await waitFor(() => expect(screen.queryByText('title')).not.toBeVisible())

    await user.keyboard('[Escape]')
    await waitFor(() => expect(screen.queryByText('title')).not.toBeVisible())
  })

  it('should focus the first focusable element', async () => {
    render(() => <ComponentUnderTest />)

    await user.click(screen.getByText('click me'))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('should allow controlled usage', async () => {
    render(() => <ControlledComponentUnderTest />)
    expect(screen.queryByText('title')).not.toBeVisible()

    await user.click(screen.getByRole('button', { name: /toggle/i }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.queryByText('title')).toBeVisible()

    await user.click(screen.getByRole('button', { name: /toggle/i }))
    await waitFor(() => expect(screen.queryByText('title')).not.toBeVisible())
  })

  it('lets present force the content to render independently of the machine state', () => {
    render(() => (
      <Popover.Root present>
        <Popover.Content data-testid="forced-content">Forced content</Popover.Content>
      </Popover.Root>
    ))

    expect(screen.getByTestId('forced-content')).toBeVisible()
    expect(screen.getByTestId('forced-content')).toHaveAttribute('data-state', 'open')
  })

  it('switches the API used by RootProvider when value changes', async () => {
    function DynamicRootProvider() {
      const first = usePopover({ id: 'first' })
      const second = usePopover({ id: 'second' })
      const [useSecond, setUseSecond] = createSignal(false)
      const current = () => useSecond() ? second : first

      return (
        <>
          <button type="button" onClick={() => setUseSecond(true)}>
            Switch API
          </button>
          <button type="button" onClick={() => current()().setOpen(true)}>
            Open current API
          </button>
          <Popover.RootProvider value={current()}>
            <Popover.Trigger>Provider trigger</Popover.Trigger>
            <Popover.Content>Provider content</Popover.Content>
          </Popover.RootProvider>
        </>
      )
    }

    render(() => <DynamicRootProvider />)
    const trigger = screen.getByRole('button', { name: 'Provider trigger' })
    expect(trigger).toHaveAttribute('id', 'popover:first:trigger')
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(screen.getByText('Provider content')).not.toBeVisible()

    await user.click(screen.getByRole('button', { name: 'Switch API' }))
    await waitFor(() => expect(trigger).toHaveAttribute('id', 'popover:second:trigger'))
    expect(trigger).toHaveAttribute('aria-expanded', 'false')

    await user.click(screen.getByRole('button', { name: 'Open current API' }))
    await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'true'))
    expect(screen.getByText('Provider content')).toBeVisible()
  })

  it('should be able to lazy mount', async () => {
    render(() => <ComponentUnderTest lazyMount />)
    expect(screen.queryByTestId('positioner')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'click me' }))
    expect(screen.getByTestId('positioner')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'close' }))
    expect(screen.getByTestId('positioner')).toBeInTheDocument()
  })

  it('should not have aria-controls if lazy mounted', async () => {
    render(() => <ComponentUnderTest lazyMount />)
    expect(screen.getByRole('button', { name: 'click me' })).not.toHaveAttribute('aria-controls')
  })

  it('should point aria-controls at the mounted popover content', async () => {
    render(() => <ComponentUnderTest lazyMount unmountOnExit={false} />)
    const trigger = screen.getByRole('button', { name: 'click me' })

    await user.click(trigger)

    const content = screen.getByRole('dialog')
    expect(trigger).toHaveAttribute('aria-controls', content.id)
  })

  it('should lazy mount and unmount on exit', async () => {
    render(() => <ComponentUnderTest lazyMount unmountOnExit />)

    expect(screen.queryByTestId('positioner')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'click me' }))
    expect(screen.getByTestId('positioner')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'close' }))
    await waitFor(() => expect(screen.queryByTestId('positioner')).not.toBeInTheDocument())
  })
})
