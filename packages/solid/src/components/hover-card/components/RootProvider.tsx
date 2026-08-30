import type { JSX } from 'solid-js'
import type { UseHoverCardReturn } from '../hooks/use-hover-card'
import type { UsePresenceProps } from '~/components/presence'
import { mergeProps } from '@destyler/solid'
import {
  PresenceProvider,
  splitPresenceProps,
  usePresence,

} from '~/components/presence'
import { HoverCardProvider } from '../hooks/use-hover-card-context'

interface RootProviderProps {
  value: UseHoverCardReturn
}

export interface HoverCardRootProviderBaseProps extends RootProviderProps, UsePresenceProps {}
export interface HoverCardRootProviderProps extends HoverCardRootProviderBaseProps {
  children?: JSX.Element
}

export function HoverCardRootProvider(props: HoverCardRootProviderProps) {
  const [presenceProps, hoverCardProps] = splitPresenceProps(props)
  const hoverCard: UseHoverCardReturn = () => hoverCardProps.value()
  const presence = usePresence(
    mergeProps(() => ({ present: hoverCard().open }), presenceProps),
  )

  return (
    <HoverCardProvider value={hoverCard}>
      <PresenceProvider value={presence}>{hoverCardProps.children}</PresenceProvider>
    </HoverCardProvider>
  )
}
