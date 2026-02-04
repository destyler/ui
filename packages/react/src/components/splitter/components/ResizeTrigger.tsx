import type { ResizeTriggerProps } from '@destyler/splitter'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import type { Assign } from '~/types'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useSplitterContext } from '../hooks/use-splitter-context'

export interface SplitterResizeTriggerBaseProps extends ResizeTriggerProps, PolymorphicProps {}
export interface SplitterResizeTriggerProps extends Assign<HTMLProps<'button'>, SplitterResizeTriggerBaseProps> {}

export const SplitterResizeTrigger = forwardRef<HTMLButtonElement, SplitterResizeTriggerProps>((props, ref) => {
  const [triggerProps, localProps] = createSplitProps<ResizeTriggerProps>()(props, ['disabled', 'id', 'step'])
  const splitter = useSplitterContext()
  const mergedProps = mergeProps(splitter.getResizeTriggerProps(triggerProps), localProps)

  return <ui.button ref={ref} {...mergedProps} />
})

SplitterResizeTrigger.displayName = 'SplitterResizeTrigger'
