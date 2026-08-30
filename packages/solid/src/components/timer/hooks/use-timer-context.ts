import type { UseTimerReturn } from './use-timer'
import { createContext } from '~/utils/create-context'

export interface UseTimerContext extends UseTimerReturn {}

const timerProviderTuple = createContext<UseTimerContext>({
  hookName: 'useTimerContext',
  providerName: '<TimerProvider />',
})

export const TimerProvider = timerProviderTuple[0]
export const useTimerContext = timerProviderTuple[1]
