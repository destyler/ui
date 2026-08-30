import type { ResizeTriggerProps } from '@destyler/floating-panel'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useFloatingPanelContext } from '../hooks/use-floating-panel-context'

export interface FloatingPanelResizeTriggerBaseProps
  extends ResizeTriggerProps,
  PolymorphicProps<'div'> {}
export interface FloatingPanelResizeTriggerProps
  extends HTMLProps<'div'>,
  FloatingPanelResizeTriggerBaseProps {}

export function FloatingPanelResizeTrigger(props: FloatingPanelResizeTriggerProps) {
  const [resizeProps, localProps] = createSplitProps<ResizeTriggerProps>()(props, ['axis'])
  const api = useFloatingPanelContext()
  const mergedProps = mergeProps(() => api().getResizeTriggerProps(resizeProps), localProps)

  return <ui.div {...mergedProps} />
}
