import type { UseComboboxReturn } from './use-combobox'
import type { CollectionItem } from '~/utils/collection'
import { createContext } from '~/utils/create-context'

export interface UseComboboxContext<T extends CollectionItem> extends UseComboboxReturn<T> {}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const [ComboboxProvider, useComboboxContext] = createContext<UseComboboxContext<any>>({
  name: 'ComboboxContext',
  hookName: 'useComboboxContext',
  providerName: '<ComboboxProvider />',
})
