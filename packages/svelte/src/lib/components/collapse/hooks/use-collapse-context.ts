import type { Accessor } from '$lib/types'
import type { Api } from '@destyler/collapse'
import type { PropTypes } from '@destyler/svelte'
import { createContext } from '../../../utils/create-context'

export interface UseCollapseContext extends Accessor<Api<PropTypes>> {}

export const [CollapseProvider, useCollapseContext] = createContext<UseCollapseContext>({
  name: 'CollapseContext',
  hookName: 'useCollapseContext',
  providerName: '<CollapseProvider />',
})
