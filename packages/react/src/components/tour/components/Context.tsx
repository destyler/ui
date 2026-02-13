import type { ReactNode } from 'react'
import type { UseTourContext } from '../hooks/use-tour-context'
import { useTourContext } from '../hooks/use-tour-context'

export interface TourContextProps {
  children: (context: UseTourContext) => ReactNode
}

export const TourContext = (props: TourContextProps) => props.children(useTourContext())
