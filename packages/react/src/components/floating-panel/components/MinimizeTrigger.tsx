import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { usePresenceContext } from '~/components/presence'
import { ui } from '~/factory'
import { useFloatingPanelContext } from '../hooks/use-floating-panel-context'

export interface FloatingPanelMinimizeTriggerBaseProps extends PolymorphicProps {}
export interface FloatingPanelMinimizeTriggerProps extends HTMLProps<'button'>, FloatingPanelMinimizeTriggerBaseProps {}

export const FloatingPanelMinimizeTrigger = forwardRef<HTMLButtonElement, FloatingPanelMinimizeTriggerProps>((props, ref) => {
  const floatingPanel = useFloatingPanelContext()
  const presence = usePresenceContext()
  const mergedProps = mergeProps(floatingPanel.getMinimizeTriggerProps(), props)

  if (presence.unmounted) {
    return null
  }

  return <ui.button {...mergedProps} ref={ref} />
})

FloatingPanelMinimizeTrigger.displayName = 'FloatingPanelMinimizeTrigger'
