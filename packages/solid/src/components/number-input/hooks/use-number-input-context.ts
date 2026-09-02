import type { UseNumberInputReturn } from './use-number-input'
import { createContext } from '~/utils/create-context'

export interface UseNumberInputContext extends UseNumberInputReturn {}

const numberInputProviderTuple = createContext<UseNumberInputContext>({
  hookName: 'useNumberInputContext',
  providerName: '<NumberInputProvider />',
})

export const NumberInputProvider = numberInputProviderTuple[0]
export const useNumberInputContext = numberInputProviderTuple[1]
