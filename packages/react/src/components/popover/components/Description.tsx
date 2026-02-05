import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { usePopoverContext } from '../hooks/use-popover-context'

export interface PopoverDescriptionBaseProps extends PolymorphicProps {}
export interface PopoverDescriptionProps extends HTMLProps<'div'>, PopoverDescriptionBaseProps {}

export const PopoverDescription = forwardRef<HTMLDivElement, PopoverDescriptionProps>((props, ref) => {
  const popover = usePopoverContext()
  const mergedProps = mergeProps(popover.getDescriptionProps(), props)

  return <ui.div {...mergedProps} ref={ref} />
})

PopoverDescription.displayName = 'PopoverDescription'
