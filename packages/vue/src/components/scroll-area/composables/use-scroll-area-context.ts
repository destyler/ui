import type { Api } from '@destyler/scroll-area'
import type { PropTypes } from '@destyler/vue'
import type { ComputedRef } from 'vue'
import { createContext } from '~/utils'

export interface UseScrollAreaContext extends ComputedRef<Api<PropTypes>> {}

export const [ScrollAreaProvider, useScrollAreaContext] = createContext<UseScrollAreaContext>('ScrollArea')
