import type { PanelProps } from '@destyler/splitter'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import type { Assign } from '~/types'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useSplitterContext } from '../hooks/use-splitter-context'

export interface SplitterPanelBaseProps extends PanelProps, PolymorphicProps<'div'> {}
export interface SplitterPanelProps extends Assign<HTMLProps<'div'>, SplitterPanelBaseProps> {}

export function SplitterPanel(props: SplitterPanelProps) {
  const [panelProps, restProps] = createSplitProps<PanelProps>()(props, ['id', 'snapSize'])
  const api = useSplitterContext()
  const mergedProps = mergeProps(() => api().getPanelProps(panelProps), restProps)

  return <ui.div {...mergedProps} />
}
