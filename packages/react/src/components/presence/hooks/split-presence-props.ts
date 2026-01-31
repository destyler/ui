import type { UsePresenceProps } from './use-presence'
import { createSplitProps } from '~/utils/create-split-props'

export function splitPresenceProps <T extends UsePresenceProps>(props: T) {
  return createSplitProps<UsePresenceProps>()(props, ['immediate', 'lazyMount', 'onExitComplete', 'present', 'unmountOnExit'])
}
