import type { UseCollapsibleReturn } from './use-collapsible.svelte'
import { createContext } from '$lib/utils/create-context'

export interface UseCollapsibleContext extends UseCollapsibleReturn {}
export const [CollapsibleProvider, useCollapsibleContext] = createContext<UseCollapsibleContext>({
  name: 'CollapsibleContext',
})
