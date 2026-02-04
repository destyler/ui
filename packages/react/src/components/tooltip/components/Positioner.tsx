import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { usePresenceContext } from '~/components/presence'
import { ui } from '~/factory'
import { useTooltipContext } from '../hooks/use-tooltip-context'

export interface TooltipPositionerBaseProps extends PolymorphicProps {}
export interface TooltipPositionerProps extends HTMLProps<'div'>, TooltipPositionerBaseProps {}

export const TooltipPositioner = forwardRef<HTMLDivElement, TooltipPositionerProps>((props, ref) => {
  const tooltip = useTooltipContext()
  const mergedProps = mergeProps(tooltip.getPositionerProps(), props)
  const presence = usePresenceContext()

  if (presence.unmounted) {
    return null
  }

  return <ui.div {...mergedProps} ref={ref} />
})

TooltipPositioner.displayName = 'TooltipPositioner'
