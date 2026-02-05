import type { UseHoverCardProps } from './use-hover-card'
import { createSplitProps } from '~/utils/create-split-props'

export function splitHoverCardProps<T extends UseHoverCardProps>(props: T) {
  return createSplitProps<UseHoverCardProps>()(props, [
    'closeDelay',
    'defaultOpen',
    'dir',
    'disabled',
    'getRootNode',
    'id',
    'ids',
    'onOpenChange',
    'open',
    'openDelay',
    'positioning',
  ])
}
