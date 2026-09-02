import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useToastContext } from '../hooks/use-toast-context'

export interface ToastTitleBaseProps extends PolymorphicProps<'div'> {}
export interface ToastTitleProps extends HTMLProps<'div'>, ToastTitleBaseProps {}

export function ToastTitle(props: ToastTitleProps) {
  const toast = useToastContext()
  const mergedProps = mergeProps(() => toast().getTitleProps(), props)

  return <ui.div {...mergedProps} />
}
