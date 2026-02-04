import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { usePresenceContext } from '~/components/presence'
import { ui } from '~/factory'
import { composeRefs } from '~/utils/compose-refs'
import { useTooltipContext } from '../hooks/use-tooltip-context'

export interface TooltipContentBaseProps extends PolymorphicProps {}
export interface TooltipContentProps extends HTMLProps<'div'>, TooltipContentBaseProps {}

export const TooltipContent = forwardRef<HTMLDivElement, TooltipContentProps>((props, ref) => {
  const tooltip = useTooltipContext()
  const presence = usePresenceContext()
  const mergedProps = mergeProps(tooltip.getContentProps(), presence.getPresenceProps(), props)

  if (presence.unmounted) {
    return null
  }

  return <ui.div {...mergedProps} ref={composeRefs(presence.ref, ref)} />
})

TooltipContent.displayName = 'TooltipContent'
