import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { usePresenceContext } from '~/components/presence'
import { ui } from '~/factory'
import { useFloatingPanelContext } from '../hooks/use-floating-panel-context'

export interface FloatingPanelBodyBaseProps extends PolymorphicProps {}
export interface FloatingPanelBodyProps extends HTMLProps<'div'>, FloatingPanelBodyBaseProps {}

export const FloatingPanelBody = forwardRef<HTMLDivElement, FloatingPanelBodyProps>((props, ref) => {
  const floatingPanel = useFloatingPanelContext()
  const presence = usePresenceContext()
  const mergedProps = mergeProps(floatingPanel.getBodyProps(), props)

  if (presence.unmounted) {
    return null
  }

  return <ui.div {...mergedProps} ref={ref} />
})

FloatingPanelBody.displayName = 'FloatingPanelBody'
