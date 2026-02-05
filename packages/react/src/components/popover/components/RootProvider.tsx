import type { UsePopoverReturn } from '../hooks/use-popover'
import type { UsePresenceProps } from '~/components/presence'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { PresenceProvider, splitPresenceProps, usePresence } from '~/components/presence'
import { ui } from '~/factory'
import { PopoverProvider } from '../hooks/use-popover-context'

interface RootProviderProps {
  value: UsePopoverReturn
}

export interface PopoverRootProviderBaseProps extends RootProviderProps, UsePresenceProps, PolymorphicProps {}
export interface PopoverRootProviderProps extends HTMLProps<'div'>, PopoverRootProviderBaseProps {}

export const PopoverRootProvider = forwardRef<HTMLDivElement, PopoverRootProviderProps>((props, ref) => {
  const [presenceProps, { value: popover, ...localProps }] = splitPresenceProps(props)
  const presence = usePresence(mergeProps({ present: popover.open }, presenceProps))

  return (
    <PopoverProvider value={popover}>
      <PresenceProvider value={presence}>
        <ui.div ref={ref} {...localProps} />
      </PresenceProvider>
    </PopoverProvider>
  )
})

PopoverRootProvider.displayName = 'PopoverRootProvider'
