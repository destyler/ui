import { render, screen, waitFor } from '@solidjs/testing-library'
import user from '@testing-library/user-event'
import { createToaster, Toast, Toaster } from '../'
import { getParts } from '../../../setup-test'
import { toastAnatomy } from '../anatomy'
import { ComponentUnderTest } from './basic'

const testToastDuration = 60_000

describe('toast', () => {
  it.each(getParts(toastAnatomy))('should render part! %s', async (part) => {
    render(() => <ComponentUnderTest duration={testToastDuration} />)
    await user.click(screen.getByText('Create Toast'))

    await waitFor(() => expect(document.querySelector(part)).toBeInTheDocument())
  })

  it('should show and hide a toast message', async () => {
    render(() => <ComponentUnderTest duration={testToastDuration} />)
    await user.click(screen.getByText('Create Toast'))

    await waitFor(() => expect(screen.queryByText('Title')).toBeVisible())
    await waitFor(() => expect(screen.queryByText('Description')).toBeVisible())
    await user.click(screen.getByText('Close'))

    await waitFor(() => expect(screen.queryByText('Title')).not.toBeInTheDocument())
    await waitFor(() => expect(screen.queryByText('Description')).not.toBeInTheDocument())
  })

  it('updates group styles when toast state changes', async () => {
    function GroupStyleFixture() {
      const toaster = createToaster({
        placement: 'bottom-end',
        overlap: true,
      })
      let toastId: string | undefined

      return (
        <>
          <button
            type="button"
            onClick={() => {
              toastId = toaster.create({ title: 'Reactive toast', duration: testToastDuration })
            }}
          >
            Create reactive toast
          </button>
          <button
            type="button"
            onClick={() => {
              if (!toastId)
                return
              toaster.machine.send({
                type: 'UPDATE_HEIGHT',
                id: toastId,
                height: 48,
                placement: 'bottom-end',
              })
            }}
          >
            Update toast height
          </button>
          <Toaster toaster={toaster}>
            {toast => <div>{toast().title}</div>}
          </Toaster>
        </>
      )
    }

    render(() => <GroupStyleFixture />)
    const group = document.querySelector<HTMLElement>('[data-scope="toast"][data-part="group"]')

    expect(group).toBeInTheDocument()
    expect(group).toHaveStyle({ 'pointer-events': 'none', '--first-height': '0px' })

    await user.click(screen.getByText('Create reactive toast'))
    await waitFor(() => expect(group).not.toHaveStyle({ 'pointer-events': 'none' }))

    await user.click(screen.getByText('Update toast height'))
    await waitFor(() => expect(group).toHaveStyle({ '--first-height': '48px' }))
  })

  it('renders the root as a child element without leaking asChild', async () => {
    function AsChildFixture() {
      const toaster = createToaster({ placement: 'bottom-end' })

      return (
        <>
          <button
            type="button"
            onClick={() => toaster.create({ title: 'As child toast', duration: testToastDuration })}
          >
            Create as-child toast
          </button>
          <Toaster toaster={toaster}>
            {toast => (
              <Toast.Root
                asChild={rootProps => (
                  <section {...rootProps({ 'aria-label': 'Custom toast root' })} />
                )}
              >
                <Toast.Title>{toast().title}</Toast.Title>
              </Toast.Root>
            )}
          </Toaster>
        </>
      )
    }

    render(() => <AsChildFixture />)
    await user.click(screen.getByText('Create as-child toast'))

    const root = await screen.findByLabelText('Custom toast root')
    expect(root.tagName).toBe('SECTION')
    expect(root).toHaveAttribute('data-scope', 'toast')
    expect(root).toHaveAttribute('data-part', 'root')
    expect(root).toHaveTextContent('As child toast')
    expect(document.querySelector('[aschild]')).not.toBeInTheDocument()
  })
})
