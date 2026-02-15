import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { usePresenceContext } from '~/components/presence'
import { ui } from '~/factory'
import { useFloatingPanelContext } from '../hooks/use-floating-panel-context'

export interface FloatingPanelRestoreTriggerBaseProps extends PolymorphicProps {}
export interface FloatingPanelRestoreTriggerProps extends HTMLProps<'button'>, FloatingPanelRestoreTriggerBaseProps {}

export const FloatingPanelRestoreTrigger = forwardRef<HTMLButtonElement, FloatingPanelRestoreTriggerProps>((props, ref) => {
  const floatingPanel = useFloatingPanelContext()
  const presence = usePresenceContext()
  const mergedProps = mergeProps(floatingPanel.getRestoreTriggerProps(), props)

  if (presence.unmounted) {
    return null
  }

  return <ui.button {...mergedProps} ref={ref} />
})

FloatingPanelRestoreTrigger.displayName = 'FloatingPanelRestoreTrigger'
