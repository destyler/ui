import type { JSX } from 'solid-js'
import type { UseTooltipProps } from '../hooks/use-tooltip'
import type { UsePresenceProps } from '~/components/presence'
import { mergeProps } from '@destyler/solid'
import {
  PresenceProvider,
  splitPresenceProps,
  usePresence,

} from '~/components/presence'
import { createSplitProps } from '~/utils/create-split-props'
import { useTooltip } from '../hooks/use-tooltip'
import { TooltipProvider } from '../hooks/use-tooltip-context'

export interface TooltipRootBaseProps extends UseTooltipProps, UsePresenceProps {}
export interface TooltipRootProps extends TooltipRootBaseProps {
  children?: JSX.Element
}
export function TooltipRoot(props: TooltipRootProps) {
  const [presenceProps, tooltipProps] = splitPresenceProps(props)
  const [useTooltipProps, localProps] = createSplitProps<UseTooltipProps>()(tooltipProps, [
    'aria-label',
    'closeDelay',
    'closeOnClick',
    'closeOnEscape',
    'closeOnPointerDown',
    'closeOnScroll',
    'defaultOpen',
    'disabled',
    'id',
    'ids',
    'interactive',
    'onOpenChange',
    'open',
    'openDelay',
    'positioning',
  ])

  const api = useTooltip(useTooltipProps)
  const apiPresence = usePresence(mergeProps(() => ({ present: api().open }), presenceProps))

  return (
    <TooltipProvider value={api}>
      <PresenceProvider value={apiPresence}>{localProps.children}</PresenceProvider>
    </TooltipProvider>
  )
}
