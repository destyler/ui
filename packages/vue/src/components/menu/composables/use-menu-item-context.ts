import type { OptionItemState } from '@destyler/menu'
import type { ComputedRef } from 'vue'
import type { Optional } from '~/types'
import { createContext } from '~/utils'

export interface UseMenuItemContext extends ComputedRef<Optional<OptionItemState, 'checked'>> {}

export const [MenuItemProvider, useMenuItemContext] = createContext<UseMenuItemContext>('MenuItemContext')
