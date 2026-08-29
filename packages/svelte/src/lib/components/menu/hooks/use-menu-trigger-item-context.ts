import type * as menu from '@destyler/menu'
import type { PropTypes } from '@destyler/svelte'
import { createContext } from '$lib/utils/create-context'

export type UseMenuTriggerItemContext = () => ReturnType<menu.Api<PropTypes>['getTriggerItemProps']> | undefined

export const [MenuTriggerItemProvider, useMenuTriggerItemContext] = createContext<UseMenuTriggerItemContext>({
  name: 'MenuTriggerItemContext',
  hookName: 'useMenuTriggerItemContext',
  providerName: '<MenuTriggerItemProvider />',
  strict: false,
})
