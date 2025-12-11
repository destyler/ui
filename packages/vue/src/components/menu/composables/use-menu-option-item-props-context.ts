import type { OptionItemProps } from '@destyler/menu'
import type { ComputedRef } from 'vue'
import { createContext } from '~/utils'

export const [MenuOptionItemPropsProvider, useMenuOptionItemPropsContext]
  = createContext<ComputedRef<OptionItemProps>>('MenuOptionItemPropsContext')
