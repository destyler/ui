import type { ItemProps } from '@destyler/collapse'
import { createContext } from '~/utils'

export interface UseCollapseItemPropsContext extends ItemProps {}

export const [CollapseItemPropsProvider, useCollapseItemPropsContext]
  = createContext<UseCollapseItemPropsContext>('CollapseItemPropsContext')
