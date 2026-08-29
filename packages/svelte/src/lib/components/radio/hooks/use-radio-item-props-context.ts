import type { Accessor } from '$lib/types'
import type { ItemProps } from '@destyler/radio'
import { createContext } from '$lib/utils/create-context'

export interface UseRadioItemPropsContext extends Accessor<ItemProps> {}

export const [RadioItemPropsProvider, useRadioItemPropsContext]
  = createContext<UseRadioItemPropsContext>({
    name: 'RadioItemPropsContext',
    hookName: 'useRadioItemPropsContext',
    providerName: '<RadioItemPropsProvider />',
  })
