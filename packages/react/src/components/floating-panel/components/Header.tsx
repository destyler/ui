import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { usePresenceContext } from '~/components/presence'
import { ui } from '~/factory'
import { useFloatingPanelContext } from '../hooks/use-floating-panel-context'

export interface FloatingPanelHeaderBaseProps extends PolymorphicProps {}
export interface FloatingPanelHeaderProps extends HTMLProps<'div'>, FloatingPanelHeaderBaseProps {}

export const FloatingPanelHeader = forwardRef<HTMLDivElement, FloatingPanelHeaderProps>((props, ref) => {
  const floatingPanel = useFloatingPanelContext()
  const presence = usePresenceContext()
  const mergedProps = mergeProps(floatingPanel.getHeaderProps(), props)

  if (presence.unmounted) {
    return null
  }

  return <ui.div {...mergedProps} ref={ref} />
})

FloatingPanelHeader.displayName = 'FloatingPanelHeader'
