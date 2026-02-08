import type { ItemGroupProps } from '@destyler/combobox'
import { createContext } from '~/utils/create-context'

export interface UseComboboxItemGroupPropsContext extends ItemGroupProps {}

export const [ComboboxItemGroupPropsProvider, useComboboxItemGroupPropsContext] = createContext<ItemGroupProps>({
  name: 'ComboboxItemGroupPropsContext',
  hookName: 'useComboboxItemGroupPropsContext',
  providerName: '<ComboboxItemGroupPropsProvider />',
})
