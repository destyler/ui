import type { StepAction } from '@destyler/tour'
import type { ReactNode } from 'react'
import { useTourContext } from '../hooks/use-tour-context'

export interface TourActionsProps {
  children: (actions: StepAction[]) => ReactNode
}

export const TourActions = (props: TourActionsProps) => props.children(useTourContext().step?.actions ?? [])
