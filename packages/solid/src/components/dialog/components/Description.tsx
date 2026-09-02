import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useDialogContext } from '../hooks/use-dialog-context'

export interface DialogDescriptionBaseProps extends PolymorphicProps<'div'> {}
export interface DialogDescriptionProps extends HTMLProps<'div'>, DialogDescriptionBaseProps {}

export function DialogDescription(props: DialogDescriptionProps) {
  const dialog = useDialogContext()
  const mergedProps = mergeProps(() => dialog().getDescriptionProps(), props)

  return <ui.div {...mergedProps} />
}
