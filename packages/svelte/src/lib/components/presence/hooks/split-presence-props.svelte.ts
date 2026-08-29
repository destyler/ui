import type { UsePresenceProps } from './use-presence.svelte'
import { createSplitProps } from '$lib/utils/create-split-props'

export function splitPresenceProps<T extends UsePresenceProps>(props: T) {
  return createSplitProps<UsePresenceProps>()(props, [
    'immediate',
    'lazyMount',
    'onExitComplete',
    'present',
    'skipAnimationOnMount',
    'unmountOnExit',
  ])
}
