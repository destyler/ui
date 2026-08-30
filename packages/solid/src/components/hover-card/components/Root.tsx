import type { JSX } from 'solid-js'
import type { UseHoverCardProps } from '../hooks/use-hover-card'
import type { UsePresenceProps } from '~/components/presence'
import { mergeProps } from '@destyler/solid'
import {
  PresenceProvider,
  splitPresenceProps,
  usePresence,

} from '~/components/presence'
import { createSplitProps } from '~/utils/create-split-props'
import { useHoverCard } from '../hooks/use-hover-card'
import { HoverCardProvider } from '../hooks/use-hover-card-context'

export interface HoverCardRootBaseProps extends UseHoverCardProps, UsePresenceProps {}
export interface HoverCardRootProps extends HoverCardRootBaseProps {
  children?: JSX.Element
}

export function HoverCardRoot(props: HoverCardRootProps) {
  const [presenceProps, hoverCardProps] = splitPresenceProps(props)
  const [useHoverCardProps, localProps] = createSplitProps<UseHoverCardProps>()(hoverCardProps, [
    'closeDelay',
    'defaultOpen',
    'id',
    'ids',
    'onOpenChange',
    'open',
    'openDelay',
    'positioning',
  ])
  const api = useHoverCard(useHoverCardProps)
  const apiPresence = usePresence(mergeProps(presenceProps, () => ({ present: api().open })))

  return (
    <HoverCardProvider value={api}>
      <PresenceProvider value={apiPresence}>{localProps.children}</PresenceProvider>
    </HoverCardProvider>
  )
}
