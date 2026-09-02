import { fireEvent, render, screen, waitFor } from '@solidjs/testing-library'
import user from '@testing-library/user-event'
import { createSignal } from 'solid-js'
import { Tour, tourAnatomy, useTour } from '../'
import { getExports } from '../../../setup-test'

function emitAnimationEnd(element: Element, animationName: string) {
  element.dispatchEvent(new AnimationEvent('animationend', { animationName, bubbles: true }))
}

function nextFrame() {
  return new Promise<void>(resolve => requestAnimationFrame(() => resolve()))
}

function ComponentUnderTest() {
  const tour = useTour({
    steps: [{ id: 'welcome', type: 'dialog', title: 'Welcome', description: 'Welcome to the tour' }],
  })

  return (
    <Tour.Root tour={tour}>
      <Tour.Context>
        {api => (
          <>
            <output>{api().open ? 'open' : 'closed'}</output>
            <button type="button" onClick={() => api().start()}>Start</button>
          </>
        )}
      </Tour.Context>
      <Tour.Positioner>
        <Tour.Content>
          <Tour.CloseTrigger>Close</Tour.CloseTrigger>
        </Tour.Content>
      </Tour.Positioner>
    </Tour.Root>
  )
}

describe('tour', () => {
  it.each(getExports(tourAnatomy))('exports %s', (part) => {
    expect(Tour[part]).toBeDefined()
  })

  it('starts through the context API', async () => {
    render(() => <ComponentUnderTest />)
    expect(screen.getByText('closed')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Start' }))
    expect(screen.getByText('open')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'close tour' }))
    expect(screen.getByText('closed')).toBeInTheDocument()
  })

  it('updates descendants when the tour instance changes', async () => {
    function DynamicTour() {
      const firstTour = useTour({
        id: 'first',
        steps: [{ id: 'first-step', type: 'dialog', title: 'First', description: 'First tour' }],
      })
      const secondTour = useTour({
        id: 'second',
        steps: [{ id: 'second-step', type: 'dialog', title: 'Second', description: 'Second tour' }],
      })
      const [useSecondTour, setUseSecondTour] = createSignal(false)

      return (
        <>
          <button type="button" onClick={() => setUseSecondTour(true)}>Switch tour</button>
          <Tour.Root tour={useSecondTour() ? secondTour : firstTour}>
            <Tour.Context>
              {api => <output>{api().getContentProps().id}</output>}
            </Tour.Context>
            <Tour.Content data-testid="dynamic-tour-content" />
          </Tour.Root>
        </>
      )
    }

    render(() => <DynamicTour />)
    expect(screen.getByText('tour-content-first')).toBeInTheDocument()
    expect(screen.getByTestId('dynamic-tour-content')).toHaveAttribute('id', 'tour-content-first')

    await user.click(screen.getByRole('button', { name: 'Switch tour' }))

    await waitFor(() => expect(screen.getByText('tour-content-second')).toBeInTheDocument())
    expect(screen.getByTestId('dynamic-tour-content')).toHaveAttribute('id', 'tour-content-second')
  })

  it('uses the root presence for content exit animations', async () => {
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
          <Tour.Root
            tour={tour}
            immediate
            unmountOnExit
            onExitComplete={onExitComplete}
          >
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
                'animation-name': tour().open ? 'backdrop-enter' : 'backdrop-exit',
                'animation-duration': '60s',
              }}
            />
          </Tour.Root>
        </>
      )
    }

    render(() => <AnimatedTour />)
    await user.click(screen.getByRole('button', { name: 'Start tour' }))
    const content = screen.getByTestId('animated-tour-content')
    const backdrop = screen.getByTestId('animated-tour-backdrop')
    expect(content).toBeVisible()
    expect(backdrop).toBeVisible()

    await user.click(screen.getByRole('button', { name: 'close tour' }))
    await Promise.resolve()
    expect(onExitComplete).not.toHaveBeenCalled()
    expect(content).toBeInTheDocument()
    expect(content).toBeVisible()
    expect(backdrop).toBeInTheDocument()
    expect(backdrop).toBeVisible()

    await nextFrame()
    emitAnimationEnd(backdrop, 'backdrop-exit')
    await waitFor(() => expect(screen.queryByTestId('animated-tour-backdrop')).not.toBeInTheDocument())

    emitAnimationEnd(content, 'tour-exit')
    await waitFor(() => expect(onExitComplete).toHaveBeenCalledOnce())
    await waitFor(() => expect(screen.queryByTestId('animated-tour-content')).not.toBeInTheDocument())
  })

  it('animates backdrop and spotlight out when the next open step no longer needs them', async () => {
    function ChangingStepTour() {
      let target: HTMLButtonElement | null = null
      const tour = useTour({
        steps: [
          {
            id: 'highlighted',
            type: 'tooltip',
            target: () => target,
            title: 'Highlighted target',
            description: 'Uses a backdrop and spotlight',
            backdrop: true,
          },
          {
            id: 'dialog',
            type: 'dialog',
            title: 'Dialog step',
            description: 'Does not use a backdrop or spotlight',
            backdrop: false,
          },
        ],
      })

      return (
        <>
          <button ref={node => (target = node)} type="button">Changing tour target</button>
          <button type="button" onClick={() => tour().start()}>Start changing tour</button>
          <output data-testid="changing-tour-status">{tour().open ? 'open' : 'closed'}</output>
          <Tour.Root tour={tour} immediate unmountOnExit>
            <Tour.Backdrop
              data-testid="changing-tour-backdrop"
              style={{
                'animation-name': tour().step?.backdrop ? 'backdrop-enter' : 'backdrop-exit',
                'animation-duration': '60s',
              }}
            />
            <Tour.Spotlight
              data-testid="changing-tour-spotlight"
              style={{
                'animation-name': tour().step?.target ? 'spotlight-enter' : 'spotlight-exit',
                'animation-duration': '60s',
              }}
            />
            <Tour.Content>
              <button type="button" onClick={() => tour().next()}>Advance tour step</button>
            </Tour.Content>
          </Tour.Root>
        </>
      )
    }

    render(() => <ChangingStepTour />)
    await user.click(screen.getByRole('button', { name: 'Start changing tour' }))

    const backdrop = screen.getByTestId('changing-tour-backdrop')
    const spotlight = screen.getByTestId('changing-tour-spotlight')
    await waitFor(() => expect(backdrop).toBeVisible())
    await waitFor(() => expect(spotlight).toBeVisible())

    await user.click(screen.getByRole('button', { name: 'Advance tour step' }))
    await waitFor(() => expect(screen.getByTestId('changing-tour-status')).toHaveTextContent('open'))
    const exitingBackdrop = await waitFor(() => screen.getByTestId('changing-tour-backdrop'))
    const exitingSpotlight = await waitFor(() => screen.getByTestId('changing-tour-spotlight'))
    expect(exitingBackdrop).toBeInTheDocument()
    expect(exitingSpotlight).toBeInTheDocument()
    expect(exitingBackdrop).toHaveAttribute('data-state', 'closed')
    expect(exitingSpotlight).toHaveAttribute('data-state', 'closed')

    await nextFrame()
    emitAnimationEnd(exitingBackdrop, 'backdrop-exit')
    emitAnimationEnd(exitingSpotlight, 'spotlight-exit')
    await waitFor(() => expect(screen.queryByTestId('changing-tour-backdrop')).not.toBeInTheDocument())
    await waitFor(() => expect(screen.queryByTestId('changing-tour-spotlight')).not.toBeInTheDocument())
    expect(screen.getByRole('button', { name: 'Advance tour step' })).toBeVisible()
  })

  it('respects the hidden prop on spotlight', async () => {
    function AnimatedSpotlightTour() {
      let target: HTMLButtonElement | null = null
      const [hidden, setHidden] = createSignal(false)
      const tour = useTour({
        steps: [{
          id: 'target',
          type: 'tooltip',
          target: () => target,
          title: 'Target',
          description: 'Target tour',
        }],
      })

      return (
        <>
          <button ref={node => (target = node)} type="button">Tour target</button>
          <button type="button" onClick={() => tour().start()}>Start spotlight tour</button>
          <button type="button" onClick={() => setHidden(value => !value)}>Toggle spotlight hidden</button>
          <Tour.Root tour={tour} immediate unmountOnExit>
            <Tour.Spotlight
              data-testid="animated-tour-spotlight"
              hidden={hidden()}
              style={{
                'animation-name': tour().open ? 'spotlight-enter' : 'spotlight-exit',
                'animation-duration': '60s',
              }}
            />
            <Tour.Content
              style={{
                'animation-name': tour().open ? 'tour-enter' : 'tour-exit',
                'animation-duration': '60s',
              }}
            >
              <Tour.CloseTrigger>Close spotlight tour</Tour.CloseTrigger>
            </Tour.Content>
          </Tour.Root>
        </>
      )
    }

    render(() => <AnimatedSpotlightTour />)
    await user.click(screen.getByRole('button', { name: 'Start spotlight tour' }))

    const spotlight = screen.getByTestId('animated-tour-spotlight')
    await waitFor(() => expect(spotlight).toBeVisible())

    fireEvent.click(screen.getByRole('button', { name: 'Toggle spotlight hidden' }))
    await waitFor(() => expect(spotlight).not.toBeVisible())
    expect(spotlight).toHaveAttribute('hidden')

    fireEvent.click(screen.getByRole('button', { name: 'Toggle spotlight hidden' }))
    await waitFor(() => expect(spotlight).toBeVisible())
    expect(spotlight).not.toHaveAttribute('hidden')
  })

  it('keeps the backdrop hidden while a target is unresolved', async () => {
    function TargetlessTour() {
      const tour = useTour({
        steps: [{
          id: 'missing-target',
          type: 'tooltip',
          target: () => null,
          title: 'Missing target',
          description: 'Target cannot be found',
          backdrop: true,
        }],
      })

      return (
        <Tour.Root tour={tour}>
          <button type="button" onClick={() => tour().start()}>Start targetless tour</button>
          <Tour.Backdrop data-testid="targetless-backdrop" />
        </Tour.Root>
      )
    }

    render(() => <TargetlessTour />)
    await user.click(screen.getByRole('button', { name: 'Start targetless tour' }))

    expect(screen.getByTestId('targetless-backdrop')).not.toBeVisible()
    expect(screen.getByTestId('targetless-backdrop')).toHaveAttribute('hidden')
  })
})
