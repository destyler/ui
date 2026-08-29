import type { Accessor } from '$lib/types'
import type { ItemState } from '@destyler/select'
import { createContext } from '$lib/utils/create-context'

export interface UseSelectItemContext extends Accessor<ItemState> {}

export const [SelectItemProvider, useSelectItemContext] = createContext<UseSelectItemContext>({
  name: 'SelectItemContext',
})
