import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { usePopoverContext } from '../hooks/use-popover-context'

export interface PopoverTitleBaseProps extends PolymorphicProps<'div'> {}
export interface PopoverTitleProps extends HTMLProps<'div'>, PopoverTitleBaseProps {}

export function PopoverTitle(props: PopoverTitleProps) {
  const api = usePopoverContext()
  const mergedProps = mergeProps(() => api().getTitleProps(), props)

  return <ui.div {...mergedProps} />
}
