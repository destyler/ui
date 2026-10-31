import type { StepDetails } from '@destyler/tour'
import { useEffect, useRef } from 'react'
import { useEvent } from '~/hooks/use-event'
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

  const start = useEvent(tour.start)
  // Starting writes event metadata. Depend on the stable command, not the
  // complete API that changes with every subscribed snapshot.
  useEffect(() => {
    start()
  }, [start])

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
