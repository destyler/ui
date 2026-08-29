import type { Accessor } from '$lib/types'
import type { ItemProps } from '@destyler/combobox'
import { createContext } from '$lib/utils/create-context'

export interface UseComboboxItemPropsContext extends Accessor<ItemProps> {}

export const [ComboboxItemPropsProvider, useComboboxItemPropsContext] = createContext<UseComboboxItemPropsContext>({
  name: 'ComboboxItemPropsContext',
  hookName: 'useComboboxItemPropsContext',
  providerName: '<ComboboxItemPropsProvider />',
})
