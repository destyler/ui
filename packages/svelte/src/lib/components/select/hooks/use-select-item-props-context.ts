import type { Accessor } from '$lib/types'
import type { CollectionItem } from '../../collection'
import { createContext } from '$lib/utils/create-context'

export interface UseSelectItemPropsContext<T extends CollectionItem = CollectionItem>
  extends Accessor<{ item: T, disabled?: boolean }> {}

export const [SelectItemPropsProvider, useSelectItemPropsContext] = createContext<UseSelectItemPropsContext>({
  name: 'SelectItemPropsContext',
})
