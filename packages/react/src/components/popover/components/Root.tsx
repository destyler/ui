import type { UsePopoverProps } from '../hooks/use-popover'
import type { UsePresenceProps } from '~/components/presence'
import type { HTMLProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { PresenceProvider, splitPresenceProps, usePresence } from '~/components/presence'
import { ui } from '~/factory'
import { usePopover } from '../hooks/use-popover'
import { PopoverProvider } from '../hooks/use-popover-context'

export interface PopoverRootBaseProps extends UsePopoverProps, UsePresenceProps {}
export interface PopoverRootProps extends HTMLProps<'div'>, PopoverRootBaseProps {}

export const PopoverRoot = forwardRef<HTMLDivElement, PopoverRootProps>((props, ref) => {
  const [presenceProps, localProps] = splitPresenceProps(props)
  const popover = usePopover(localProps)
  const presence = usePresence(mergeProps({ present: popover.open }, presenceProps))

  return (
    <PopoverProvider value={popover}>
      <PresenceProvider value={presence}>
        <ui.div ref={ref} {...localProps} />
      </PresenceProvider>
    </PopoverProvider>
  )
})

PopoverRoot.displayName = 'PopoverRoot'
