import type { UseComboboxReturn } from './use-combobox'
import type { CollectionItem } from '~/types'
import { createContext } from '~/utils/create-context'

export interface UseComboboxContext<T extends CollectionItem> extends UseComboboxReturn<T> {}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const comboboxProviderTuple = createContext<UseComboboxContext<any>>({
  hookName: 'useComboboxContext',
  providerName: '<ComboboxProvider />',
})

export const ComboboxProvider = comboboxProviderTuple[0]
export const useComboboxContext = comboboxProviderTuple[1]
