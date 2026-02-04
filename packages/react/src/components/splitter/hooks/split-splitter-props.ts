import type { UseSplitterProps } from './use-splitter'
import { createSplitProps } from '~/utils/create-split-props'

export function splitSplitterProps<T extends UseSplitterProps>(props: T) {
  return createSplitProps<UseSplitterProps>()(props, [
    'defaultSize',
    'id',
    'ids',
    'onSizeChange',
    'onSizeChangeEnd',
    'orientation',
    'size',
  ])
}
