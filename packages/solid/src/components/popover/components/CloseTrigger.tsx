import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { usePopoverContext } from '../hooks/use-popover-context'

export interface PopoverCloseTriggerBaseProps extends PolymorphicProps<'button'> {}
export interface PopoverCloseTriggerProps
  extends HTMLProps<'button'>,
  PopoverCloseTriggerBaseProps {}

export function PopoverCloseTrigger(props: PopoverCloseTriggerProps) {
  const api = usePopoverContext()
  const mergedProps = mergeProps(() => api().getCloseTriggerProps(), props)

  return <ui.button {...mergedProps} />
}
