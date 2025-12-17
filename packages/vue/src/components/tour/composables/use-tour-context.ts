import type { UseTourReturn } from './use-tour'
import { createContext } from '~/utils'

export interface UseTourContext extends UseTourReturn {}

export const [TourProvider, useTourContext] = createContext<UseTourContext>('TourContext')
