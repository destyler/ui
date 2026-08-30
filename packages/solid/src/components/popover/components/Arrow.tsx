import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { usePopoverContext } from '../hooks/use-popover-context'

export interface PopoverArrowBaseProps extends PolymorphicProps<'div'> {}
export interface PopoverArrowProps extends HTMLProps<'div'>, PopoverArrowBaseProps {}

export function PopoverArrow(props: PopoverArrowProps) {
  const popover = usePopoverContext()
  const mergedProps = mergeProps(() => popover().getArrowProps(), props)

  return <ui.div {...mergedProps} />
}
