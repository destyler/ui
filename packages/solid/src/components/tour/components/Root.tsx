import type { JSX } from 'solid-js'
import type { UseTourReturn } from '../hooks/use-tour'
import type { UsePresenceProps } from '~/components/presence'
import { mergeProps } from '@destyler/solid'
import {
  PresenceProvider,
  splitPresenceProps,
  usePresence,

} from '~/components/presence'
import { RenderStrategyProvider, splitRenderStrategyProps } from '~/utils/render-strategy'
import { TourProvider } from '../hooks/use-tour-context'

interface RootProps {
  tour: UseTourReturn
}

export interface TourRootBaseProps extends RootProps, UsePresenceProps {}
export interface TourRootProps extends TourRootBaseProps {
  children?: JSX.Element
}

export function TourRoot(props: TourRootProps) {
  const [presenceProps, rootProps] = splitPresenceProps(props)
  const [renderStrategyProps] = splitRenderStrategyProps(presenceProps)
  const tour: UseTourReturn = () => rootProps.tour()

  const presence = usePresence(
    mergeProps(() => ({ present: tour().open }), presenceProps),
  )

  return (
    <TourProvider value={tour}>
      <RenderStrategyProvider value={renderStrategyProps}>
        <PresenceProvider value={presence}>{rootProps.children}</PresenceProvider>
      </RenderStrategyProvider>
    </TourProvider>
  )
}
