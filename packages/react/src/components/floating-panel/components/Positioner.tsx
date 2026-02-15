import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { usePresenceContext } from '~/components/presence'
import { ui } from '~/factory'
import { useFloatingPanelContext } from '../hooks/use-floating-panel-context'

export interface FloatingPanelPositionerBaseProps extends PolymorphicProps {}
export interface FloatingPanelPositionerProps extends HTMLProps<'div'>, FloatingPanelPositionerBaseProps {}

export const FloatingPanelPositioner = forwardRef<HTMLDivElement, FloatingPanelPositionerProps>((props, ref) => {
  const floatingPanel = useFloatingPanelContext()
  const presence = usePresenceContext()
  const mergedProps = mergeProps(floatingPanel.getPositionerProps(), props)

  if (presence.unmounted) {
    return null
  }

  return <ui.div {...mergedProps} ref={ref} />
})

FloatingPanelPositioner.displayName = 'FloatingPanelPositioner'
