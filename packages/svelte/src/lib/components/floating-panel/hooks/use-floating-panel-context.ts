import type { Accessor } from '$lib/types.js'
import type * as floatingPanel from '@destyler/floating-panel'
import type { PropTypes } from '@destyler/svelte'
import { createContext } from '../../../utils/create-context.js'

export interface UseFloatingPanelContext extends Accessor<floatingPanel.Api<PropTypes>> {}

export const [FloatingPanelProvider, useFloatingPanelContext] = createContext<UseFloatingPanelContext>({
  name: 'FloatingPanelContext',
  hookName: 'useFloatingPanelContext',
  providerName: '<FloatingPanelProvider />',
})
