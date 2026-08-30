import type { ItemProps } from '@destyler/combobox'
import { createContext } from '~/utils/create-context'

export interface UseComboboxItemPropsContext extends ItemProps {}

const comboboxItemPropsProviderTuple = createContext<UseComboboxItemPropsContext>({
  hookName: 'useComboboxItemPropsContext',
  providerName: '<ComboboxItemPropsProvider />',
})

export const ComboboxItemPropsProvider = comboboxItemPropsProviderTuple[0]
export const useComboboxItemPropsContext = comboboxItemPropsProviderTuple[1]
