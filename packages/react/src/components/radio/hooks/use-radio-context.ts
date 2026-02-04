import type { UseRadioReturn } from './use-radio'
import { createContext } from '~/utils/create-context'

export interface UseRadioContext extends UseRadioReturn {}

export const [RadioProvider, useRadioContext] = createContext<UseRadioContext>({
  name: 'RadioContext',
  hookName: 'useRadioContext',
  providerName: '<RadioProvider />',
})
