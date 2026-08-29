import type { Accessor } from '$lib/types'
import type { ItemState } from '@destyler/combobox'
import { createContext } from '$lib/utils/create-context'

export interface UseComboboxItemContext extends Accessor<ItemState> {}

export const [ComboboxItemProvider, useComboboxItemContext] = createContext<UseComboboxItemContext>({
  name: 'ComboboxItemContext',
  hookName: 'useComboboxItemContext',
  providerName: '<ComboboxItemProvider />',
})
