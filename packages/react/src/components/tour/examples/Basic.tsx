import type { StepDetails } from '@destyler/tour'
import { useEffect, useRef } from 'react'
import { Tour, useTour } from '../index'

export function Basic() {
  const targetRef = useRef<HTMLButtonElement>(null)

  const steps: StepDetails[] = [
    {
      id: 'step-1',
      type: 'tooltip',
      title: 'Welcome',
      description: 'Welcome to the tour!',
      target: () => targetRef.current,
      arrow: true,
      backdrop: true,
    },
  ]

  const tour = useTour({ steps })

  const startRef = useRef(tour.start)
  useEffect(() => {
    startRef.current = tour.start
  }, [tour.start])
  // Starting writes event metadata. Start only on mount, not whenever the
  // complete API changes with a subscribed snapshot. Keep this effect after
  // the ref update so it uses the latest command, including in StrictMode.
  useEffect(() => {
    startRef.current()
  }, [])

  return (
    <main>
      <button ref={targetRef}>
        Target
      </button>

      <Tour.Root tour={tour}>
        <Tour.Backdrop />
        <Tour.Spotlight />
        <Tour.Positioner>
          <Tour.Content>
            <Tour.Arrow>
              <Tour.ArrowTip />
            </Tour.Arrow>
            <Tour.Title />
            <Tour.Description />
            <Tour.ProgressText />
            <Tour.Control>
              <Tour.ActionTrigger action={{ action: 'prev', label: 'Prev' }}>Prev</Tour.ActionTrigger>
              <Tour.ActionTrigger action={{ action: 'next', label: 'Next' }}>Next</Tour.ActionTrigger>
            </Tour.Control>
            <Tour.CloseTrigger>X</Tour.CloseTrigger>
          </Tour.Content>
        </Tour.Positioner>
      </Tour.Root>
    </main>
  )
}
