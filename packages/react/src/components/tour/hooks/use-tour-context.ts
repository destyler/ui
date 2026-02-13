import type { PropTypes } from '@destyler/react'
import type * as tour from '@destyler/tour'
import { createContext } from '~/utils/create-context'

export interface UseTourContext extends tour.Api<PropTypes> {}

export const [TourProvider, useTourContext] = createContext<UseTourContext>({
  name: 'TourContext',
  hookName: 'useTourContext',
  providerName: '<TourProvider />',
})
