import { render, screen, waitFor } from '@solidjs/testing-library'
import user from '@testing-library/user-event'
import { createSignal } from 'solid-js'
import { Calendar, calendarAnatomy } from '../'
import { getExports, getParts } from '../../../setup-test'
import { ComponentUnderTest } from './basic'

describe('date Picker', () => {
  it.each(getParts(calendarAnatomy))('should render part %s', async (part) => {
    render(() => <ComponentUnderTest />)

    expect(document.querySelector(part)).toBeInTheDocument()
  })

  it.each(getExports(calendarAnatomy))('should export %s', async (part) => {
    expect(Calendar[part]).toBeDefined()
  })

  it('should be able to lazy mount', async () => {
    render(() => <ComponentUnderTest lazyMount />)

    expect(screen.queryByTestId('positioner')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Open calendar' }))
    expect(screen.getByTestId('positioner')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Close calendar' }))
    await waitFor(() => expect(screen.getByTestId('positioner')).toBeInTheDocument())
  })

  it('should lazy mount and unmount on exit', async () => {
    render(() => <ComponentUnderTest lazyMount unmountOnExit />)

    expect(screen.queryByTestId('positioner')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Open calendar' }))
    expect(screen.getByTestId('positioner')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Close calendar' }))
    await waitFor(() => expect(screen.queryByTestId('positioner')).not.toBeInTheDocument())
  })

  it('should be fully controlled (true)', async () => {
    render(() => <ComponentUnderTest open={true} />)

    const closeButton = screen.getByRole('button', { name: 'Close calendar' })

    expect(closeButton).toBeVisible()

    await user.click(closeButton)
    expect(closeButton).toBeVisible()
  })

  it('should be fully controlled (false)', async () => {
    render(() => <ComponentUnderTest open={false} />)

    const closeButton = screen.queryByRole('button', { name: 'Close calendar' })
    expect(closeButton).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Open calendar' }))
    expect(closeButton).not.toBeInTheDocument()
  })

  it('updates table columns and view props reactively', async () => {
    const [columns, setColumns] = createSignal(7)
    const [view, setView] = createSignal<'day' | 'month'>('day')

    render(() => (
      <Calendar.Root>
        <Calendar.View view={view()}>
          <Calendar.Table columns={columns()} data-testid="table">
            <Calendar.TableBody data-testid="table-body" />
          </Calendar.Table>
        </Calendar.View>
      </Calendar.Root>
    ))

    expect(screen.getByTestId('table')).toHaveAttribute('data-columns', '7')
    expect(screen.getByTestId('table')).toHaveAttribute('data-view', 'day')
    expect(screen.getByTestId('table-body')).toHaveAttribute('data-view', 'day')

    setColumns(4)
    setView('month')

    await waitFor(() => expect(screen.getByTestId('table')).toHaveAttribute('data-columns', '4'))
    expect(screen.getByTestId('table')).toHaveAttribute('data-view', 'month')
    expect(screen.getByTestId('table-body')).toHaveAttribute('data-view', 'month')
  })

  it('adds readonly to the input when readOnly changes', async () => {
    const [readOnly, setReadOnly] = createSignal(false)

    render(() => (
      <Calendar.Root readOnly={readOnly()}>
        <Calendar.Input data-testid="calendar-input" />
      </Calendar.Root>
    ))

    const input = screen.getByTestId('calendar-input')
    expect(input).not.toHaveAttribute('readonly')

    setReadOnly(true)
    await waitFor(() => expect(input).toHaveAttribute('readonly'))
  })
})
