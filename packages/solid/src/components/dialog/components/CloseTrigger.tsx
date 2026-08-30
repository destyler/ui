import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useDialogContext } from '../hooks/use-dialog-context'

export interface DialogCloseTriggerBaseProps extends PolymorphicProps<'button'> {}
export interface DialogCloseTriggerProps extends HTMLProps<'button'>, DialogCloseTriggerBaseProps {}

export function DialogCloseTrigger(props: DialogCloseTriggerProps) {
  const dialog = useDialogContext()
  const mergedProps = mergeProps(() => dialog().getCloseTriggerProps(), props)

  return <ui.button {...mergedProps} />
}
