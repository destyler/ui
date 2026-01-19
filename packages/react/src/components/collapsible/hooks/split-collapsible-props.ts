import type { UseCollapsibleProps } from './use-collapsible'
import { createSplitProps } from '~/utils/create-split-props'

export function splitCollapsibleProps<T extends UseCollapsibleProps>(props: T) {
  return createSplitProps<UseCollapsibleProps>()(props, [
    'defaultOpen',
    'disabled',
    'id',
    'ids',
    'lazyMount',
    'onExitComplete',
    'onOpenChange',
    'open',
    'unmountOnExit',
  ])
}
