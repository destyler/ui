import type { Accessor } from '$lib/types'
import type { ItemState } from '@destyler/radio'
import { createContext } from '../../../utils/create-context'

export interface UseRadioItemContext extends Accessor<ItemState> {}

export const [RadioItemProvider, useRadioItemContext] = createContext<UseRadioItemContext>({
  name: 'RadioItemContext',
  hookName: 'useRadioItemContext',
  providerName: '<RadioItemProvider />',
})
