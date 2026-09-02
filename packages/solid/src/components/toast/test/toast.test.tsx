import { fireEvent, render, screen, waitFor } from '@solidjs/testing-library'
import user from '@testing-library/user-event'
import { createSignal, Show } from 'solid-js'
import { createToaster, Toast, Toaster } from '../'
import { getParts } from '../../../setup-test'
import { toastAnatomy } from '../anatomy'
import { Action } from '../examples/Action'
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

  it('keeps toaster instances in examples isolated', async () => {
    render(() => (
      <>
        <Action />
        <Action />
      </>
    ))

    await user.click(screen.getAllByRole('button', { name: 'Add Toast' })[0])

    await waitFor(() => expect(screen.getAllByText('Toast Title')).toHaveLength(1))
  })

  it('uses unique group ids and focuses the most recently active toaster', async () => {
    function MultipleToasters() {
      const first = createToaster({ placement: 'bottom-end' })
      const second = createToaster({ placement: 'bottom-end' })

      return (
        <>
          <button
            type="button"
            onClick={() => first.create({ title: 'First toast', duration: testToastDuration })}
          >
            Create first toast
          </button>
          <button
            type="button"
            onClick={() => second.create({ title: 'Second toast', duration: testToastDuration })}
          >
            Create second toast
          </button>
          <Toaster data-testid="first-toast-group" toaster={first}>
            {toast => <div>{toast().title}</div>}
          </Toaster>
          <Toaster data-testid="second-toast-group" toaster={second}>
            {toast => <div>{toast().title}</div>}
          </Toaster>
        </>
      )
    }

    render(() => <MultipleToasters />)
    const firstGroup = screen.getByTestId('first-toast-group')
    const secondGroup = screen.getByTestId('second-toast-group')

    expect(firstGroup.id).not.toBe(secondGroup.id)
    expect(firstGroup.id).toMatch(/^toast-group:bottom-end:/)
    expect(secondGroup.id).toMatch(/^toast-group:bottom-end:/)

    await user.click(screen.getByRole('button', { name: 'Create second toast' }))
    await screen.findByText('Second toast')
    fireEvent.keyDown(document, { altKey: true, code: 'KeyT' })
    await waitFor(() => expect(secondGroup).toHaveFocus())
    expect(firstGroup).not.toHaveFocus()

    await user.click(screen.getByRole('button', { name: 'Create first toast' }))
    await screen.findByText('First toast')
    fireEvent.keyDown(document, { altKey: true, code: 'KeyT' })
    await waitFor(() => expect(firstGroup).toHaveFocus())
    expect(secondGroup).not.toHaveFocus()
  })

  it('removes unmounted toaster instances from hotkey routing', async () => {
    function HotkeyCleanupFixture() {
      const live = createToaster({ placement: 'bottom-end' })
      const removed = createToaster({ placement: 'bottom-end' })
      const [showRemoved, setShowRemoved] = createSignal(true)

      return (
        <>
          <button
            type="button"
            onClick={() => live.create({ title: 'Live toast', duration: testToastDuration })}
          >
            Create live toast
          </button>
          <button
            type="button"
            onClick={() => removed.create({ title: 'Removed toast', duration: testToastDuration })}
          >
            Create removed toast
          </button>
          <button type="button" onClick={() => setShowRemoved(false)}>
            Unmount removed toaster
          </button>
          <Toaster data-testid="live-toast-group" toaster={live}>
            {toast => <div>{toast().title}</div>}
          </Toaster>
          <Show when={showRemoved()}>
            <Toaster data-testid="removed-toast-group" toaster={removed}>
              {toast => <div>{toast().title}</div>}
            </Toaster>
          </Show>
        </>
      )
    }

    render(() => <HotkeyCleanupFixture />)
    await user.click(screen.getByRole('button', { name: 'Create live toast' }))
    await user.click(screen.getByRole('button', { name: 'Create removed toast' }))
    await screen.findByText('Removed toast')

    const liveGroup = screen.getByTestId('live-toast-group')
    await user.click(screen.getByRole('button', { name: 'Unmount removed toaster' }))
    expect(screen.queryByTestId('removed-toast-group')).not.toBeInTheDocument()

    fireEvent.keyDown(document, { altKey: true, code: 'KeyT' })
    await waitFor(() => expect(liveGroup).toHaveFocus())
  })

  it('removes the document hotkey listener after the last toaster unmounts', () => {
    const addEventListener = vi.spyOn(document, 'addEventListener')
    const removeEventListener = vi.spyOn(document, 'removeEventListener')

    function SingleToaster() {
      const toaster = createToaster({ placement: 'bottom-end' })
      return <Toaster toaster={toaster}>{toast => <div>{toast().title}</div>}</Toaster>
    }

    const view = render(() => <SingleToaster />)
    const registration = addEventListener.mock.calls.find(
      ([type, , options]) => type === 'keydown' && options === true,
    )
    expect(registration).toBeDefined()

    view.unmount()

    expect(removeEventListener).toHaveBeenCalledWith('keydown', registration![1], true)
    addEventListener.mockRestore()
    removeEventListener.mockRestore()
  })
})
