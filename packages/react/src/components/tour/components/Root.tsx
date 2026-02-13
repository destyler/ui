import type { ReactNode } from 'react'
import type { UseTourReturn } from '../hooks/use-tour'
import type { UsePresenceProps } from '~/components/presence'
import { mergeProps } from '@destyler/react'
import { PresenceProvider, splitPresenceProps, usePresence } from '~/components/presence'
import { RenderStrategyPropsProvider, splitRenderStrategyProps } from '~/utils/render-strategy'
import { TourProvider } from '../hooks/use-tour-context'

export interface TourRootBaseProps extends UsePresenceProps {
  tour: UseTourReturn
}
export interface TourRootProps extends TourRootBaseProps {
  children?: ReactNode
}

export function TourRoot(props: TourRootProps) {
  const [presenceProps, { children, tour }] = splitPresenceProps(props)
  const [renderStrategyProps] = splitRenderStrategyProps(presenceProps)
  const presence = usePresence(mergeProps({ present: tour.open }, presenceProps))

  return (
    <TourProvider value={tour}>
      <RenderStrategyPropsProvider value={renderStrategyProps}>
        <PresenceProvider value={presence}>{children}</PresenceProvider>
      </RenderStrategyPropsProvider>
    </TourProvider>
  )
}
