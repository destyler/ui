import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { usePopoverContext } from '../hooks/use-popover-context'

export interface PopoverCloseTriggerBaseProps extends PolymorphicProps {}
export interface PopoverCloseTriggerProps extends HTMLProps<'button'>, PopoverCloseTriggerBaseProps {}

export const PopoverCloseTrigger = forwardRef<HTMLButtonElement, PopoverCloseTriggerProps>((props, ref) => {
  const popover = usePopoverContext()
  const mergedProps = mergeProps(popover.getCloseTriggerProps(), props)

  return <ui.button {...mergedProps} ref={ref} />
})

PopoverCloseTrigger.displayName = 'PopoverCloseTrigger'
