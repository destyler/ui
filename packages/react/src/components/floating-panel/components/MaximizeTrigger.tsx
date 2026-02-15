import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { usePresenceContext } from '~/components/presence'
import { ui } from '~/factory'
import { useFloatingPanelContext } from '../hooks/use-floating-panel-context'

export interface FloatingPanelMaximizeTriggerBaseProps extends PolymorphicProps {}
export interface FloatingPanelMaximizeTriggerProps extends HTMLProps<'button'>, FloatingPanelMaximizeTriggerBaseProps {}

export const FloatingPanelMaximizeTrigger = forwardRef<HTMLButtonElement, FloatingPanelMaximizeTriggerProps>((props, ref) => {
  const floatingPanel = useFloatingPanelContext()
  const presence = usePresenceContext()
  const mergedProps = mergeProps(floatingPanel.getMaximizeTriggerProps(), props)

  if (presence.unmounted) {
    return null
  }

  return <ui.button {...mergedProps} ref={ref} />
})

FloatingPanelMaximizeTrigger.displayName = 'FloatingPanelMaximizeTrigger'
