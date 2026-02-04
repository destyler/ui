import type { PanelProps } from '@destyler/splitter'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import type { Assign } from '~/types'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useSplitterContext } from '../hooks/use-splitter-context'

export interface SplitterPanelBaseProps extends PanelProps, PolymorphicProps {}
export interface SplitterPanelProps extends Assign<HTMLProps<'div'>, SplitterPanelBaseProps> {}

export const SplitterPanel = forwardRef<HTMLDivElement, SplitterPanelProps>((props, ref) => {
  const [splitterPanelProps, localProps] = createSplitProps<PanelProps>()(props, ['id', 'snapSize'])
  const splitter = useSplitterContext()
  const mergedProps = mergeProps(splitter.getPanelProps(splitterPanelProps), localProps)

  return <ui.div {...mergedProps} ref={ref} />
})

SplitterPanel.displayName = 'SplitterPanel'
