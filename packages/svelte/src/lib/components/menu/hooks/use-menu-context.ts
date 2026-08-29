import type { Accessor } from '$lib/types'
import type { UseMenuReturn } from './use-menu.svelte'
import { createContext } from '$lib/utils/create-context'

export type UseMenuContext = Accessor<ReturnType<UseMenuReturn>['api']>

export const [MenuProvider, useMenuContext] = createContext<UseMenuContext>({
  name: 'MenuContext',
  hookName: 'useMenuContext',
  providerName: '<MenuProvider />',
  strict: false,
})

export function useRequiredMenuContext(): UseMenuContext {
  const context = useMenuContext()
  if (context)
    return context

  const error = new Error('useMenuContext returned `undefined`. Seems you forgot to wrap component within <MenuProvider />')
  error.name = 'ContextError'
  throw error
}
