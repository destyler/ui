import type { ComputedRef } from 'vue'
import type { UseMenuReturn } from './use-menu'
import { createContext } from '~/utils'

export type UseMenuTriggerItemContext = ComputedRef<
  ReturnType<UseMenuReturn['api']['value']['getTriggerItemProps']> | undefined
>

export const [MenuTriggerItemProvider, useMenuTriggerItemContext]
  = createContext<UseMenuTriggerItemContext>('MenuTriggerItemContext')
