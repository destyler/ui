import type { StepAction } from '@destyler/tour'
import type { Accessor, JSX } from 'solid-js'

import { useTourContext } from '../hooks/use-tour-context'

export interface TourActionsProps {
  children: (actions: Accessor<StepAction[]>) => JSX.Element
}

export function TourActions(props: TourActionsProps) {
  const tour = useTourContext()
  return props.children(() => tour().step?.actions ?? [])
}
