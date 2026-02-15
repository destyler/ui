import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useFloatingPanelContext } from '../hooks/use-floating-panel-context'

export interface FloatingPanelTriggerBaseProps extends PolymorphicProps {}
export interface FloatingPanelTriggerProps extends HTMLProps<'button'>, FloatingPanelTriggerBaseProps {}

export const FloatingPanelTrigger = forwardRef<HTMLButtonElement, FloatingPanelTriggerProps>((props, ref) => {
  const floatingPanel = useFloatingPanelContext()
  const mergedProps = mergeProps(floatingPanel.getTriggerProps(), props)

  return <ui.button {...mergedProps} ref={ref} />
})

FloatingPanelTrigger.displayName = 'FloatingPanelTrigger'
