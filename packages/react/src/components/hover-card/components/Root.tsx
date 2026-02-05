import type { ReactNode } from 'react'
import type { UseHoverCardProps } from '../hooks/use-hover-card'
import type { UsePresenceProps } from '~/components/presence'
import { mergeProps } from '@destyler/react'
import { PresenceProvider, usePresence } from '~/components/presence'
import { splitPresenceProps } from '~/components/presence/hooks/split-presence-props'
import { useHoverCard } from '../hooks/use-hover-card'
import { HoverCardProvider } from '../hooks/use-hover-card-context'

export interface HoverCardRootBaseProps extends UseHoverCardProps, UsePresenceProps {}
export interface HoverCardRootProps extends HoverCardRootBaseProps {
  children?: ReactNode
}

export function HoverCardRoot(props: HoverCardRootProps) {
  const [presenceProps, { children, ...localProps }] = splitPresenceProps(props)
  const hoverCard = useHoverCard(localProps)
  const presence = usePresence(mergeProps({ present: hoverCard.open }, presenceProps))

  return (
    <HoverCardProvider value={hoverCard}>
      <PresenceProvider value={presence}>{children}</PresenceProvider>
    </HoverCardProvider>
  )
}
