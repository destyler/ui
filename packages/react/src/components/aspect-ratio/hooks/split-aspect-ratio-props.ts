import type { UseAspectRatioProps } from './use-aspect-ratio'
import { createSplitProps } from '~/utils/create-split-props'

export function splitAspectRatioProps<T extends UseAspectRatioProps>(props: T) {
  return createSplitProps<UseAspectRatioProps>()(props, [
    'defaultRatio',
    'id',
    'ids',
    'ratio',
  ])
}
