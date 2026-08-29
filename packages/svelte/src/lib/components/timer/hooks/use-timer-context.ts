import type { UseTimerReturn } from './use-timer.svelte'
import { createContext } from '$lib/utils/create-context'

export interface UseTimerContext extends UseTimerReturn {}

export const [TimerProvider, useTimerContext] = createContext<UseTimerContext>({
  name: 'TimerContext',
})
