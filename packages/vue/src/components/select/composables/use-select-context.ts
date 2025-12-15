import type { UseSelectReturn } from './use-select'
import type { CollectionItem } from '~/utils/collection'
import { createContext } from '~/utils'

export interface UseSelectContext<T extends CollectionItem> extends UseSelectReturn<T> {}

export const [SelectProvider, useSelectContext] = createContext<UseSelectContext<CollectionItem>>('SelectContext')
