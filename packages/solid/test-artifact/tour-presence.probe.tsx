import { cleanup, fireEvent, render, screen, waitFor } from '@solidjs/testing-library'
import user from '@testing-library/user-event'
import { Tour, useTour } from '../src/components/tour'

// These are real DOM/style assertions in Chromium. Only frame delivery is controlled:
// closing before the first frame is a supported interaction, not a timing assumption.
function controlFrames() {
  const frames = new Map<number, FrameRequestCallback>()
  let nextId = 0
  vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
    frames.set(++nextId, callback)
    return nextId
  })
  vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(id => frames.delete(id))
  return async () => {
    expect(frames.size, 'the probe must exercise queued frame work').toBeGreaterThan(0)
    for (const [id, callback] of [...frames]) {
      if (frames.delete(id))
        callback(0)
    }
    await Promise.resolve()
  }
}

function emitAnimation(element: Element, type: 'animationstart' | 'animationend', animationName: string) {
  element.dispatchEvent(new AnimationEvent(type, { animationName, bubbles: true }))
}

function setup(backdropExitName = 'backdrop-exit') {
  const flush = controlFrames()
  const onExitComplete = vi.fn()

  function AnimatedTour() {
    const tour = useTour({
      steps: [{
        id: 'welcome',
        type: 'dialog',
        title: 'Welcome',
        description: 'Welcome tour',
        backdrop: true,
      }],
    })
    return (
      <>
        <button type="button" onClick={() => tour().start()}>Start tour</button>
        <Tour.Root tour={tour} immediate unmountOnExit onExitComplete={onExitComplete}>
          <Tour.Content
            data-testid="animated-tour-content"
            style={{
              'animation-name': tour().open ? 'tour-enter' : 'tour-exit',
              'animation-duration': '60s',
            }}
          >
            Animated tour
            <Tour.CloseTrigger>Close tour</Tour.CloseTrigger>
          </Tour.Content>
          <Tour.Backdrop
            data-testid="animated-tour-backdrop"
            style={{
              'animation-name': tour().open ? 'backdrop-enter' : backdropExitName,
              'animation-duration': '60s',
            }}
          />
        </Tour.Root>
      </>
    )
  }

  render(() => <AnimatedTour />)
  const startButton = screen.getByRole('button', { name: 'Start tour' })
  return { flush, onExitComplete, startButton }
}

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

describe('packed Presence Tour regressions', () => {
  it('retains backdrop when closed before its first frame', async () => {
    const { flush, onExitComplete, startButton } = setup()
    await user.click(startButton)
    const content = screen.getByTestId('animated-tour-content')
    const backdrop = screen.getByTestId('animated-tour-backdrop')
    expect(content).toBeVisible()
    expect(backdrop).toBeVisible()

    await user.click(screen.getByRole('button', { name: 'close tour' }))
    await flush()
    // Preserve every assertion from the original content-exit regression.
    expect(onExitComplete).not.toHaveBeenCalled()
    expect(content).toBeInTheDocument()
    expect(content).toBeVisible()
    expect(backdrop, 'PRESENCE_EARLY_EXIT: backdrop detached before animationend').toBeInTheDocument()
    expect(backdrop).toBeVisible()

    emitAnimation(backdrop, 'animationend', 'backdrop-exit')
    await waitFor(() => expect(screen.queryByTestId('animated-tour-backdrop')).not.toBeInTheDocument())
    emitAnimation(content, 'animationend', 'tour-exit')
    await waitFor(() => expect(onExitComplete).toHaveBeenCalledOnce())
    await waitFor(() => expect(screen.queryByTestId('animated-tour-content')).not.toBeInTheDocument())
  })

  it('refreshes the enter sample after reopening before the first frame', async () => {
    const { flush, onExitComplete, startButton } = setup('backdrop-enter')
    await user.click(startButton)
    const backdrop = screen.getByTestId('animated-tour-backdrop')
    await user.click(screen.getByRole('button', { name: 'close tour' }))
    // The retained dialog may aria-hide the outside trigger, so use its known element.
    fireEvent.click(startButton)
    await waitFor(() => expect(backdrop).toHaveAttribute('data-state', 'open'))
    await flush()
    expect(backdrop, 'PRESENCE_REOPEN_SAMPLE: reopened backdrop detached').toBeInTheDocument()
    expect(backdrop).toBeVisible()
    expect(backdrop).toHaveAttribute('data-state', 'open')
    expect(onExitComplete).not.toHaveBeenCalled()

    await user.click(screen.getByRole('button', { name: 'close tour' }))
    await flush()
    // There is no new exit animation: an unchanged enter name must unmount now.
    expect(screen.queryByTestId('animated-tour-backdrop'), 'PRESENCE_REOPEN_SAMPLE: unchanged animation was retained').not.toBeInTheDocument()
    const content = screen.getByTestId('animated-tour-content')
    expect(content).toBeVisible()
    emitAnimation(content, 'animationend', 'tour-exit')
    await waitFor(() => expect(onExitComplete).toHaveBeenCalledOnce())
    await waitFor(() => expect(screen.queryByTestId('animated-tour-content')).not.toBeInTheDocument())
  })

  it('retains a repeated exit after reopening during a suspended exit', async () => {
    const { flush, onExitComplete, startButton } = setup()
    await user.click(startButton)
    await flush()
    const content = screen.getByTestId('animated-tour-content')
    const backdrop = screen.getByTestId('animated-tour-backdrop')
    await user.click(screen.getByRole('button', { name: 'close tour' }))
    await flush()
    expect(backdrop).toBeVisible()
    emitAnimation(backdrop, 'animationstart', 'backdrop-exit')

    fireEvent.click(startButton)
    await waitFor(() => expect(backdrop).toHaveAttribute('data-state', 'open'))
    expect(backdrop).toHaveAttribute('data-state', 'open')
    await user.click(screen.getByRole('button', { name: 'close tour' }))
    await flush()
    expect(onExitComplete).not.toHaveBeenCalled()
    expect(content).toBeInTheDocument()
    expect(content).toBeVisible()
    expect(backdrop, 'PRESENCE_REPEAT_EXIT: previous exit name detached the new exit').toBeInTheDocument()
    expect(backdrop).toBeVisible()
    expect(backdrop).toHaveAttribute('data-state', 'closed')
    emitAnimation(backdrop, 'animationend', 'backdrop-exit')
    await waitFor(() => expect(screen.queryByTestId('animated-tour-backdrop')).not.toBeInTheDocument())
    emitAnimation(content, 'animationend', 'tour-exit')
    await waitFor(() => expect(onExitComplete).toHaveBeenCalledOnce())
    await waitFor(() => expect(screen.queryByTestId('animated-tour-content')).not.toBeInTheDocument())
  })
})
