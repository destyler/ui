import type { Optional } from '$lib/types'
import type { UseCollapsibleProps } from './use-collapsible.svelte'
import { createSplitProps } from '$lib/utils/create-split-props'

type CollapsibleMachineProps = Optional<UseCollapsibleProps, 'id'>

const splitFn = createSplitProps<CollapsibleMachineProps>()

export function splitCollapsibleProps<T extends CollapsibleMachineProps>(props: T) {
  return splitFn(props, [
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
