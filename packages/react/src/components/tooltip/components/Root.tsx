import type { ReactNode } from 'react'
import type { UseTooltipProps } from '../hooks/use-tooltip'
import type { UsePresenceProps } from '~/components/presence'
import { mergeProps } from '@destyler/react'
import { PresenceProvider, usePresence } from '~/components/presence'
import { splitPresenceProps } from '~/components/presence/hooks/split-presence-props'
import { useTooltip } from '../hooks/use-tooltip'
import { TooltipProvider } from '../hooks/use-tooltip-context'

export interface TooltipRootBaseProps extends UseTooltipProps, UsePresenceProps {}
export interface TooltipRootProps extends TooltipRootBaseProps {
  children?: ReactNode
}

export function TooltipRoot(props: TooltipRootProps) {
  const [presenceProps, { children, ...localProps }] = splitPresenceProps(props)
  const tooltip = useTooltip(localProps)
  const presence = usePresence(mergeProps({ present: tooltip.open }, presenceProps))

  return (
    <TooltipProvider value={tooltip}>
      <PresenceProvider value={presence}>{children}</PresenceProvider>
    </TooltipProvider>
  )
}
