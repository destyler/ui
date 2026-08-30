import type { UseTourReturn } from './use-tour'
import { createContext } from '~/utils/create-context'

export interface UseTourContext extends UseTourReturn {}

const tourProviderTuple = createContext<UseTourContext>({
  hookName: 'useTourContext',
  providerName: '<TourProvider />',
})

export const TourProvider = tourProviderTuple[0]
export const useTourContext = tourProviderTuple[1]
