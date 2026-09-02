import type { ResizeTriggerProps } from '@destyler/splitter'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import type { Assign } from '~/types'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useSplitterContext } from '../hooks/use-splitter-context'

export interface SplitterResizeTriggerBaseProps
  extends ResizeTriggerProps,
  PolymorphicProps<'button'> {}
export interface SplitterResizeTriggerProps
  extends Assign<HTMLProps<'button'>, SplitterResizeTriggerBaseProps> {}

export function SplitterResizeTrigger(props: SplitterResizeTriggerProps) {
  const [resizeTriggerProps, restProps] = createSplitProps<ResizeTriggerProps>()(props, [
    'disabled',
    'id',
    'step',
  ])
  const api = useSplitterContext()
  const mergedProps = mergeProps({ type: 'button' }, () => api().getResizeTriggerProps(resizeTriggerProps), restProps)

  return <ui.button {...mergedProps} />
}
