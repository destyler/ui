import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useToastContext } from '../hooks/use-toast-context'

export interface ToastActionTriggerBaseProps extends PolymorphicProps<'button'> {}
export interface ToastActionTriggerProps extends HTMLProps<'button'>, ToastActionTriggerBaseProps {}

export function ToastActionTrigger(props: ToastActionTriggerProps) {
  const toast = useToastContext()
  const mergedProps = mergeProps(() => toast().getActionTriggerProps(), props)

  return <ui.button {...mergedProps} />
}
