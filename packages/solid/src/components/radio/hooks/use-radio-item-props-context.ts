import type { ItemProps } from '@destyler/radio'
import { createContext } from '~/utils/create-context'

const radioItemPropsProviderTuple = createContext<ItemProps>({
  hookName: 'useRadioItemPropsContext',
  providerName: '<RadioItemPropsProvider />',
})

export const RadioItemPropsProvider = radioItemPropsProviderTuple[0]
export const useRadioItemPropsContext = radioItemPropsProviderTuple[1]
