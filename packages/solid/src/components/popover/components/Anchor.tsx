import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { usePopoverContext } from '../hooks/use-popover-context'

export interface PopoverAnchorBaseProps extends PolymorphicProps<'div'> {}
export interface PopoverAnchorProps extends HTMLProps<'div'>, PopoverAnchorBaseProps {}

export function PopoverAnchor(props: PopoverAnchorProps) {
  const api = usePopoverContext()
  const mergedProps = mergeProps(() => api().getAnchorProps(), props)

  return <ui.div {...mergedProps} />
}
