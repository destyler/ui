import type { ItemState } from '@destyler/dynamic'
import type { Accessor } from 'solid-js'
import { createContext } from '~/utils/create-context'

export interface UseDynamicItemContext extends Accessor<ItemState> {}

const dynamicItemProviderTuple = createContext<UseDynamicItemContext>({
  hookName: 'useDynamicItemContext',
  providerName: '<DynamicItemProvider />',
})

export const DynamicItemProvider = dynamicItemProviderTuple[0]
export const useDynamicItemContext = dynamicItemProviderTuple[1]
