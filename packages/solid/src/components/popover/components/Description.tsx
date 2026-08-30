import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { usePopoverContext } from '../hooks/use-popover-context'

export interface PopoverDescriptionBaseProps extends PolymorphicProps<'div'> {}
export interface PopoverDescriptionProps extends HTMLProps<'div'>, PopoverDescriptionBaseProps {}

export function PopoverDescription(props: PopoverDescriptionProps) {
  const api = usePopoverContext()
  const mergedProps = mergeProps(() => api().getDescriptionProps(), props)

  return <ui.div {...mergedProps} />
}
