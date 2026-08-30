import type { ItemGroupProps } from '@destyler/select'
import { createContext } from '~/utils/create-context'

export interface UseSelectItemGroupPropsContext extends ItemGroupProps {}

const selectItemGroupPropsProviderTuple = createContext<ItemGroupProps>({
  hookName: 'useSelectItemGroupPropsContext',
  providerName: '<SelectItemGroupPropsProvider />',
})

export const SelectItemGroupPropsProvider = selectItemGroupPropsProviderTuple[0]
export const useSelectItemGroupPropsContext = selectItemGroupPropsProviderTuple[1]
