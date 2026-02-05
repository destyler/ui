import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { usePresenceContext } from '~/components/presence'
import { ui } from '~/factory'
import { usePopoverContext } from '../hooks/use-popover-context'

export interface PopoverTriggerBaseProps extends PolymorphicProps {}
export interface PopoverTriggerProps extends HTMLProps<'button'>, PopoverTriggerBaseProps {}

export const PopoverTrigger = forwardRef<HTMLButtonElement, PopoverTriggerProps>((props, ref) => {
  const popover = usePopoverContext()
  const presence = usePresenceContext()
  const mergedProps = mergeProps(
    {
      ...popover.getTriggerProps(),
      'aria-controls': presence.unmounted ? undefined : popover.getTriggerProps()['aria-controls'],
    },
    props,
  )

  return <ui.button {...mergedProps} ref={ref} />
})

PopoverTrigger.displayName = 'PopoverTrigger'
