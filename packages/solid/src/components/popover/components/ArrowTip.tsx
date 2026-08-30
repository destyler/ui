import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { usePopoverContext } from '../hooks/use-popover-context'

export interface PopoverArrowTipBaseProps extends PolymorphicProps<'div'> {}
export interface PopoverArrowTipProps extends HTMLProps<'div'>, PopoverArrowTipBaseProps {}

export function PopoverArrowTip(props: PopoverArrowTipProps) {
  const popover = usePopoverContext()
  const mergedProps = mergeProps(() => popover().getArrowTipProps(), props)

  return <ui.div {...mergedProps} />
}
