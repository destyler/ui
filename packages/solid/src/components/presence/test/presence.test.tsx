import type { PresenceProps } from '../'
import { fireEvent, render, screen, waitFor } from '@solidjs/testing-library'
import user from '@testing-library/user-event'
import { createSignal } from 'solid-js'
import { Presence } from '../'

function ComponentUnderTest(props: PresenceProps) {
  const [present, setPresent] = createSignal(false)
  return (
    <>
      <button type="button" onClick={() => setPresent(!present())}>
        Toggle
      </button>
      <Presence present={present()} {...props} data-testid="box">
        I am a red box
      </Presence>
    </>
  )
}

describe('presence', () => {
  it('should control presence when not lazy mounting and not unmounting on exit', async () => {
    render(() => <ComponentUnderTest />)
    expect(screen.queryByTestId('box')).not.toBeVisible()

    await user.click(screen.getByRole('button'))
    expect(screen.queryByTestId('box')).toBeVisible()

    await user.click(screen.getByRole('button'))
    await waitFor(() => expect(screen.queryByTestId('box')).not.toBeVisible())
  })

  it('should control presence when lazy mounting and not unmounting on exit', async () => {
    render(() => <ComponentUnderTest lazyMount />)
    expect(screen.queryByTestId('box')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button'))
    expect(screen.queryByTestId('box')).toBeVisible()

    await user.click(screen.getByRole('button'))
    await waitFor(() => expect(screen.queryByTestId('box')).not.toBeVisible())
  })

  it('should control presence when not lazy mounting and unmounting on exit ', async () => {
    render(() => <ComponentUnderTest unmountOnExit />)
    expect(screen.queryByTestId('box')).not.toBeVisible()

    await user.click(screen.getByRole('button'))
    expect(screen.queryByTestId('box')).toBeVisible()

    await user.click(screen.getByRole('button'))
    await waitFor(() => expect(screen.queryByTestId('box')).not.toBeInTheDocument())
  })

  it('should control presence when lazy mounting and unmounting on exit', async () => {
    render(() => <ComponentUnderTest lazyMount unmountOnExit />)

    expect(screen.queryByTestId('box')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button'))
    expect(screen.queryByTestId('box')).toBeVisible()

    await user.click(screen.getByRole('button'))
    await waitFor(() => expect(screen.queryByTestId('box')).not.toBeInTheDocument())
  })

  it('preserves exit animations when a user ref is provided', async () => {
    const [present, setPresent] = createSignal(true)
    let userNode: HTMLDivElement | undefined

    render(() => (
      <>
        <button type="button" onClick={() => setPresent(false)}>
          Hide
        </button>
        <Presence
          ref={node => (userNode = node)}
          present={present()}
          immediate
          unmountOnExit
          data-testid="animated-box"
          style={{
            'animation-name': present() ? 'presence-enter' : 'presence-exit',
            'animation-duration': '60s',
          }}
        >
          Animated box
        </Presence>
      </>
    ))

    const box = screen.getByTestId('animated-box')
    expect(userNode).toBe(box)

    await user.click(screen.getByRole('button', { name: 'Hide' }))
    await waitFor(() => expect(box).toHaveAttribute('data-state', 'closed'))
    expect(box).toBeInTheDocument()

    fireEvent.animationEnd(box)
    await waitFor(() => expect(screen.queryByTestId('animated-box')).not.toBeInTheDocument())
  })
})
