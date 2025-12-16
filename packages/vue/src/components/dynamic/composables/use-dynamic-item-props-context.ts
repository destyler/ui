import type { ItemProps } from '@destyler/dynamic'
import { createContext } from '~/utils'

export interface UseDynamicItemPropsContext extends ItemProps {}

export const [DynamicItemPropsProvider, useDynamicItemPropsContext]
  = createContext<UseDynamicItemPropsContext>('DynamicItemPropsContext')
