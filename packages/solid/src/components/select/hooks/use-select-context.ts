import type { UseSelectReturn } from './use-select'
import type { CollectionItem } from '~/types'
import { createContext } from '~/utils/create-context'

export interface UseSelectContext<T extends CollectionItem> extends UseSelectReturn<T> {}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const selectProviderTuple = createContext<UseSelectContext<any>>({
  hookName: 'useSelectContext',
  providerName: '<SelectProvider />',
})

export const SelectProvider = selectProviderTuple[0]
export const useSelectContext = selectProviderTuple[1]
