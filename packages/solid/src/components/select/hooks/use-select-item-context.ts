import type { ItemState } from '@destyler/select'
import type { Accessor } from 'solid-js'
import { createContext } from '~/utils/create-context'

export interface UseSelectItemContext extends Accessor<ItemState> {}

const selectItemProviderTuple = createContext<UseSelectItemContext>({
  hookName: 'useSelectItemContext',
  providerName: '<SelectItemProvider />',
})

export const SelectItemProvider = selectItemProviderTuple[0]
export const useSelectItemContext = selectItemProviderTuple[1]
