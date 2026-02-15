import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { usePresenceContext } from '~/components/presence'
import { ui } from '~/factory'
import { useFloatingPanelContext } from '../hooks/use-floating-panel-context'

export interface FloatingPanelDragTriggerBaseProps extends PolymorphicProps {}
export interface FloatingPanelDragTriggerProps extends HTMLProps<'div'>, FloatingPanelDragTriggerBaseProps {}

export const FloatingPanelDragTrigger = forwardRef<HTMLDivElement, FloatingPanelDragTriggerProps>((props, ref) => {
  const floatingPanel = useFloatingPanelContext()
  const presence = usePresenceContext()
  const mergedProps = mergeProps(floatingPanel.getDragTriggerProps(), props)

  if (presence.unmounted) {
    return null
  }

  return <ui.div {...mergedProps} ref={ref} />
})

FloatingPanelDragTrigger.displayName = 'FloatingPanelDragTrigger'
