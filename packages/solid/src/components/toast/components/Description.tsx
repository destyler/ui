import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useToastContext } from '../hooks/use-toast-context'

export interface ToastDescriptionBaseProps extends PolymorphicProps<'div'> {}
export interface ToastDescriptionProps extends HTMLProps<'div'>, ToastDescriptionBaseProps {}

export function ToastDescription(props: ToastDescriptionProps) {
  const toast = useToastContext()
  const mergedProps = mergeProps(() => toast().getDescriptionProps(), props)

  return <ui.div {...mergedProps} />
}
