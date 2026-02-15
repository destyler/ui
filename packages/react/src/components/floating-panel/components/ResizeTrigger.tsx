import type { ResizeTriggerAxis } from '@destyler/floating-panel'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { usePresenceContext } from '~/components/presence'
import { ui } from '~/factory'
import { useFloatingPanelContext } from '../hooks/use-floating-panel-context'

export interface FloatingPanelResizeTriggerBaseProps extends PolymorphicProps {
  /**
   * The axis for resizing
   */
  axis: ResizeTriggerAxis
}
export interface FloatingPanelResizeTriggerProps extends HTMLProps<'div'>, FloatingPanelResizeTriggerBaseProps {}

export const FloatingPanelResizeTrigger = forwardRef<HTMLDivElement, FloatingPanelResizeTriggerProps>((props, ref) => {
  const { axis, ...restProps } = props
  const floatingPanel = useFloatingPanelContext()
  const presence = usePresenceContext()
  const mergedProps = mergeProps(floatingPanel.getResizeTriggerProps({ axis }), restProps)

  if (presence.unmounted) {
    return null
  }

  return <ui.div {...mergedProps} ref={ref} />
})

FloatingPanelResizeTrigger.displayName = 'FloatingPanelResizeTrigger'
