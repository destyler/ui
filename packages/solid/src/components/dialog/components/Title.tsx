import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useDialogContext } from '../hooks/use-dialog-context'

export interface DialogTitleBaseProps extends PolymorphicProps<'h2'> {}
export interface DialogTitleProps extends HTMLProps<'h2'>, DialogTitleBaseProps {}

export function DialogTitle(props: DialogTitleProps) {
  const dialog = useDialogContext()
  const mergedProps = mergeProps(() => dialog().getTitleProps(), props)

  return <ui.h2 {...mergedProps} />
}
