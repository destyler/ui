import type { JSX } from 'solid-js'

import type { UseTourContext } from '../hooks/use-tour-context'
import { useTourContext } from '../hooks/use-tour-context'

export interface TourContextProps {
  children: (context: UseTourContext) => JSX.Element
}

export const TourContext = (props: TourContextProps) => props.children(useTourContext())
