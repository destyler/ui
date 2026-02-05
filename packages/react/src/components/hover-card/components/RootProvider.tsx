import type { ReactNode } from 'react'
import type { UseHoverCardReturn } from '../hooks/use-hover-card'
import type { UsePresenceProps } from '~/components/presence'
import { mergeProps } from '@destyler/react'
import { PresenceProvider, usePresence } from '~/components/presence'
import { splitPresenceProps } from '~/components/presence/hooks/split-presence-props'
import { HoverCardProvider } from '../hooks/use-hover-card-context'

interface RootProviderProps {
  value: UseHoverCardReturn
}

export interface HoverCardRootProviderBaseProps extends RootProviderProps, UsePresenceProps {}
export interface HoverCardRootProviderProps extends HoverCardRootProviderBaseProps {
  children?: ReactNode
}

export function HoverCardRootProvider(props: HoverCardRootProviderProps) {
  const [presenceProps, { value: hoverCard, children }] = splitPresenceProps(props)
  const presence = usePresence(mergeProps({ present: hoverCard.open }, presenceProps))

  return (
    <HoverCardProvider value={hoverCard}>
      <PresenceProvider value={presence}>{children}</PresenceProvider>
    </HoverCardProvider>
  )
}
