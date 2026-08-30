import type { JSX } from 'solid-js'
import type { UseTooltipReturn } from '../hooks/use-tooltip'
import type { UsePresenceProps } from '~/components/presence'
import { mergeProps } from '@destyler/solid'
import {
  PresenceProvider,
  splitPresenceProps,
  usePresence,

} from '~/components/presence'
import { TooltipProvider } from '../hooks/use-tooltip-context'

interface RootProviderProps {
  value: UseTooltipReturn
}

export interface TooltipRootProviderBaseProps extends RootProviderProps, UsePresenceProps {}
export interface TooltipRootProviderProps extends TooltipRootProviderBaseProps {
  children?: JSX.Element
}

export function TooltipRootProvider(props: TooltipRootProviderProps) {
  const [presenceProps, tooltipProps] = splitPresenceProps(props)
  const tooltip: UseTooltipReturn = () => tooltipProps.value()
  const presence = usePresence(
    mergeProps(() => ({ present: tooltip().open }), presenceProps),
  )

  return (
    <TooltipProvider value={tooltip}>
      <PresenceProvider value={presence}>{tooltipProps.children}</PresenceProvider>
    </TooltipProvider>
  )
}
