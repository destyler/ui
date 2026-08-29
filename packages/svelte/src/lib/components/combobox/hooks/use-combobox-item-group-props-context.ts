import type { Accessor } from '$lib/types'
import type { ItemGroupProps } from '@destyler/combobox'
import { createContext } from '$lib/utils/create-context'

export interface UseComboboxItemGroupPropsContext extends Accessor<ItemGroupProps> {}

export const [ComboboxItemGroupPropsProvider, useComboboxItemGroupPropsContext]
  = createContext<UseComboboxItemGroupPropsContext>({
    name: 'ComboboxItemGroupPropsContext',
  })
