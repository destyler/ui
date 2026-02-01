import type { UseTimerReturn } from './use-timer'
import { createContext } from '~/utils/create-context'

export interface UseTimerContext extends UseTimerReturn {}

export const [TimerProvider, useTimerContext] = createContext<UseTimerContext>({
  name: 'TimerContext',
  hookName: 'useTimerContext',
  providerName: '<TimerProvider />',
})
