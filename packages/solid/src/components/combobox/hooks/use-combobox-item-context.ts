import type { ItemState } from '@destyler/combobox'
import type { Accessor } from 'solid-js'
import { createContext } from '~/utils/create-context'

export interface UseComboboxItemContext extends Accessor<ItemState> {}

const comboboxItemProviderTuple = createContext<UseComboboxItemContext>(
  {
    hookName: 'useComboboxItemContext',
    providerName: '<ComboboxItemProvider />',
  },
)

export const ComboboxItemProvider = comboboxItemProviderTuple[0]
export const useComboboxItemContext = comboboxItemProviderTuple[1]
