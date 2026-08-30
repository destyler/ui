import type { ItemProps } from '@destyler/dynamic'
import { createContext } from '~/utils/create-context'

const dynamicItemPropsProviderTuple = createContext<ItemProps>({
  hookName: 'useDynamicItemPropsContext',
  providerName: '<DynamicItemPropsProvider />',
})

export const DynamicItemPropsProvider = dynamicItemPropsProviderTuple[0]
export const useDynamicItemPropsContext = dynamicItemPropsProviderTuple[1]
