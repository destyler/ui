import type { JSX } from 'solid-js'
import type { UsePopoverReturn } from '../hooks/use-popover'
import type { UsePresenceProps } from '~/components/presence'
import { mergeProps } from '@destyler/solid'
import {
  PresenceProvider,
  splitPresenceProps,
  usePresence,

} from '~/components/presence'
import { PopoverProvider } from '../hooks/use-popover-context'

interface RootProviderProps {
  value: UsePopoverReturn
}

export interface PopoverRootProviderBaseProps extends RootProviderProps, UsePresenceProps {}
export interface PopoverRootProviderProps extends PopoverRootProviderBaseProps {
  children?: JSX.Element
}

export function PopoverRootProvider(props: PopoverRootProviderProps) {
  const [presenceProps, popoverProps] = splitPresenceProps(props)
  const popover: UsePopoverReturn = () => popoverProps.value()
  const presence = usePresence(
    mergeProps(() => ({ present: popover().open }), presenceProps),
  )

  return (
    <PopoverProvider value={popover}>
      <PresenceProvider value={presence}>{popoverProps.children}</PresenceProvider>
    </PopoverProvider>
  )
}
