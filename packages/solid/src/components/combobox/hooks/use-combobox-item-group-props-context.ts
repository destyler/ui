import type { ItemGroupProps } from '@destyler/combobox'
import { createContext } from '~/utils/create-context'

export interface UseComboboxItemGroupPropsContext extends ItemGroupProps {}

const comboboxItemGroupPropsProviderTuple = createContext<ItemGroupProps>({
  hookName: 'useComboboxItemGroupPropsContext',
  providerName: '<ComboboxItemGroupPropsProvider />',
})

export const ComboboxItemGroupPropsProvider = comboboxItemGroupPropsProviderTuple[0]
export const useComboboxItemGroupPropsContext = comboboxItemGroupPropsProviderTuple[1]
