import type { Accessor } from '$lib/types'
import { createContext } from '$lib/utils/create-context'

export interface UseDynamicItemContext extends Accessor<{ index: number, value: string }> {}

export const [DynamicItemProvider, useDynamicItemContext] = createContext<UseDynamicItemContext>({
  name: 'DynamicItemContext',
})
