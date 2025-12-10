import type { UseComboboxReturn } from './use-combobox'
import type { UsePresenceProps } from '~/components/presence'
import type { CollectionItem } from '~/utils'
import { createContext } from '~/utils'

export interface UseComboboxContext<T extends CollectionItem = CollectionItem>
  extends UseComboboxReturn<T>,
  UsePresenceProps {}

export const [ComboboxProvider, useComboboxContext]
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  = createContext<UseComboboxContext<any>>('ComboboxContext')
