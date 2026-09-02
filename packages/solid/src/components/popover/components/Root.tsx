import type { JSX } from 'solid-js'
import type { UsePopoverProps } from '../hooks/use-popover'
import type { UsePresenceProps } from '~/components/presence'
import { mergeProps } from '@destyler/solid'
import {
  PresenceProvider,
  splitPresenceProps,
  usePresence,

} from '~/components/presence'
import { createSplitProps } from '~/utils/create-split-props'
import { usePopover } from '../hooks/use-popover'
import { PopoverProvider } from '../hooks/use-popover-context'

export interface PopoverRootBaseProps extends UsePopoverProps, UsePresenceProps {}
export interface PopoverRootProps extends PopoverRootBaseProps {
  children?: JSX.Element
}

export function PopoverRoot(props: PopoverRootProps) {
  const [presenceProps, popoverProps] = splitPresenceProps(props)
  const [usePopoverProps, localProps] = createSplitProps<UsePopoverProps>()(popoverProps, [
    'autoFocus',
    'closeOnEscape',
    'closeOnInteractOutside',
    'defaultOpen',
    'id',
    'ids',
    'initialFocusEl',
    'modal',
    'onEscapeKeyDown',
    'onFocusOutside',
    'onInteractOutside',
    'onOpenChange',
    'onPointerDownOutside',
    'open',
    'persistentElements',
    'portalled',
    'positioning',
  ])
  const api = usePopover(usePopoverProps)
  const apiPresence = usePresence(mergeProps(() => ({ present: api().open }), presenceProps))

  return (
    <PopoverProvider value={api}>
      <PresenceProvider value={apiPresence}>{localProps.children}</PresenceProvider>
    </PopoverProvider>
  )
}
