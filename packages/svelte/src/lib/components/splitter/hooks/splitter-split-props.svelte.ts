import type { Optional } from '$lib/types'
import type { UseSplitterProps } from './use-splitter.svelte'
import { createSplitProps } from '$lib/utils/create-split-props'

type SplitterRootMachineProps = Optional<UseSplitterProps, 'id'>

export function splitSplitterProps<T extends SplitterRootMachineProps>(props: T) {
  return createSplitProps<SplitterRootMachineProps>()(props, [
    'defaultSize',
    'id',
    'ids',
    'onSizeChange',
    'onSizeChangeEnd',
    'orientation',
    'size',
  ])
}
