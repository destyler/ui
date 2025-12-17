import type { UseTimerReturn } from './use-timer'
import { createContext } from '~/utils'

export interface UseTimerContext extends UseTimerReturn {}

export const [TimerProvider, useTimerContext] = createContext<UseTimerContext>('TimerContext')
