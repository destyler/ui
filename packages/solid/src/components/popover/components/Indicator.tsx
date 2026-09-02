import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { usePopoverContext } from '../hooks/use-popover-context'

export interface PopoverIndicatorBaseProps extends PolymorphicProps<'div'> {}
export interface PopoverIndicatorProps extends HTMLProps<'div'>, PopoverIndicatorBaseProps {}

export function PopoverIndicator(props: PopoverIndicatorProps) {
  const popover = usePopoverContext()
  const mergedProps = mergeProps(() => popover().getIndicatorProps(), props)

  return <ui.div {...mergedProps} />
}
