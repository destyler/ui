import type { ItemGroupProps } from '@destyler/select'
import { createContext } from '~/utils'

export interface UseSelectItemGroupPropsContext extends ItemGroupProps {}

export const [SelectItemGroupPropsProvider, useSelectItemGroupPropsContext]
  = createContext<UseSelectItemGroupPropsContext>('SelectItemGroupPropsContext')
