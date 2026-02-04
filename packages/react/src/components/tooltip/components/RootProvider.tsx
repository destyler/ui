import type { ReactNode } from 'react'
import type { UseTooltipReturn } from '../hooks/use-tooltip'
import type { UsePresenceProps } from '~/components/presence'
import { mergeProps } from '@destyler/react'
import { PresenceProvider, usePresence } from '~/components/presence'
import { splitPresenceProps } from '~/components/presence/hooks/split-presence-props'
import { TooltipProvider } from '../hooks/use-tooltip-context'

interface RootProviderProps {
  value: UseTooltipReturn
}

export interface TooltipRootProviderBaseProps extends RootProviderProps, UsePresenceProps {}
export interface TooltipRootProviderProps extends TooltipRootProviderBaseProps {
  children?: ReactNode
}

export function TooltipRootProvider(props: TooltipRootProviderProps) {
  const [presenceProps, { value: tooltip, children }] = splitPresenceProps(props)
  const presence = usePresence(mergeProps({ present: tooltip.open }, presenceProps))

  return (
    <TooltipProvider value={tooltip}>
      <PresenceProvider value={presence}>{children}</PresenceProvider>
    </TooltipProvider>
  )
}
