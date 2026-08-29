import type { Accessor } from '$lib/types'
import type { ItemProps } from '@destyler/dynamic'
import { createContext } from '$lib/utils/create-context'

export interface UseDynamicItemPropsContext extends Accessor<ItemProps> {}

export const [DynamicItemPropsProvider, useDynamicItemPropsContext] = createContext<UseDynamicItemPropsContext>({
  name: 'DynamicItemPropsContext',
})
