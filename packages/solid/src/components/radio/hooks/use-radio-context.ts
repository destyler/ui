import type { UseRadioReturn } from './use-radio'
import { createContext } from '~/utils/create-context'

export interface UseRadioContext extends UseRadioReturn {}

const radioProviderTuple = createContext<UseRadioContext>({
  hookName: 'useRadioContext',
  providerName: '<RadioProvider />',
})

export const RadioProvider = radioProviderTuple[0]
export const useRadioContext = radioProviderTuple[1]
