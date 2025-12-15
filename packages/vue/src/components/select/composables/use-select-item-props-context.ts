import type { ItemProps } from '@destyler/select'
import { createContext } from '~/utils'

export interface UseSelectItemPropsContext extends ItemProps {}

export const [SelectItemPropsProvider, useSelectItemPropsContext]
  = createContext<UseSelectItemPropsContext>('SelectItemPropsContext')
