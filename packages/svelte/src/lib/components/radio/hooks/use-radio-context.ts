import type { UseRadioReturn } from './use-radio.svelte'
import { createContext } from '$lib/utils/create-context'

export interface UseRadioContext extends UseRadioReturn {}

export const [RadioProvider, useRadioContext] = createContext<UseRadioContext>({
  name: 'RadioContext',
  hookName: 'useRadioContext',
  providerName: '<RadioProvider />',
})
