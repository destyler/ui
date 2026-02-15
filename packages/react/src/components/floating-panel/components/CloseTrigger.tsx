import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { usePresenceContext } from '~/components/presence'
import { ui } from '~/factory'
import { useFloatingPanelContext } from '../hooks/use-floating-panel-context'

export interface FloatingPanelCloseTriggerBaseProps extends PolymorphicProps {}
export interface FloatingPanelCloseTriggerProps extends HTMLProps<'button'>, FloatingPanelCloseTriggerBaseProps {}

export const FloatingPanelCloseTrigger = forwardRef<HTMLButtonElement, FloatingPanelCloseTriggerProps>((props, ref) => {
  const floatingPanel = useFloatingPanelContext()
  const presence = usePresenceContext()
  const mergedProps = mergeProps(floatingPanel.getCloseTriggerProps(), props)

  if (presence.unmounted) {
    return null
  }

  return <ui.button {...mergedProps} ref={ref} />
})

FloatingPanelCloseTrigger.displayName = 'FloatingPanelCloseTrigger'
