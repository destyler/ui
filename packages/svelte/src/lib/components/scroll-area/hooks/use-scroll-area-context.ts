import type { Accessor } from '$lib/types.js'
import type * as scrollArea from '@destyler/scroll-area'
import type { PropTypes } from '@destyler/svelte'
import { createContext } from '../../../utils/create-context.js'

export interface UseScrollAreaContext extends Accessor<scrollArea.Api<PropTypes>> {}

export const [ScrollAreaProvider, useScrollAreaContext] = createContext<UseScrollAreaContext>({
  name: 'ScrollAreaContext',
  hookName: 'useScrollAreaContext',
  providerName: '<ScrollAreaProvider />',
})
