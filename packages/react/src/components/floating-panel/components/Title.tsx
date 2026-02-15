import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { usePresenceContext } from '~/components/presence'
import { ui } from '~/factory'
import { useFloatingPanelContext } from '../hooks/use-floating-panel-context'

export interface FloatingPanelTitleBaseProps extends PolymorphicProps {}
export interface FloatingPanelTitleProps extends HTMLProps<'h2'>, FloatingPanelTitleBaseProps {}

export const FloatingPanelTitle = forwardRef<HTMLHeadingElement, FloatingPanelTitleProps>((props, ref) => {
  const floatingPanel = useFloatingPanelContext()
  const presence = usePresenceContext()
  const mergedProps = mergeProps(floatingPanel.getTitleProps(), props)

  if (presence.unmounted) {
    return null
  }

  return <ui.h2 {...mergedProps} ref={ref} />
})

FloatingPanelTitle.displayName = 'FloatingPanelTitle'
