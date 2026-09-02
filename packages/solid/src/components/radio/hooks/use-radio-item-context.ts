import type { ItemState } from '@destyler/radio'
import type { Accessor } from 'solid-js'
import { createContext } from '~/utils/create-context'

export interface UseRadioItemContext extends Accessor<ItemState> {}

const radioItemProviderTuple = createContext<UseRadioItemContext>({
  hookName: 'useRadioItemContext',
  providerName: '<RadioItemProvider />',
})

export const RadioItemProvider = radioItemProviderTuple[0]
export const useRadioItemContext = radioItemProviderTuple[1]
