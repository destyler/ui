import type { Optional } from '$lib/types'
import type { UseClipboardProps } from './use-clipboard.svelte'
import { createSplitProps } from '$lib/utils/create-split-props'

type ClipboardMachineProps = Optional<UseClipboardProps, 'id'>

const splitFn = createSplitProps<ClipboardMachineProps>()

export function splitClipboardProps<T extends ClipboardMachineProps>(props: T) {
  return splitFn(props, ['id', 'ids', 'onStatusChange', 'timeout', 'value'])
}
