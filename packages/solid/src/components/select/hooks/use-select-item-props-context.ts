import type { ItemProps } from '@destyler/select'
import { createContext } from '~/utils/create-context'

const selectItemPropsProviderTuple = createContext<ItemProps>({
  hookName: 'useSelectItemPropsContext',
  providerName: '<SelectItemPropsProvider />',
})

export const SelectItemPropsProvider = selectItemPropsProviderTuple[0]
export const useSelectItemPropsContext = selectItemPropsProviderTuple[1]
