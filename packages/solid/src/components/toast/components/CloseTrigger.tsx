import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useToastContext } from '../hooks/use-toast-context'

export interface ToastCloseTriggerBaseProps extends PolymorphicProps<'button'> {}
export interface ToastCloseTriggerProps extends HTMLProps<'button'>, ToastCloseTriggerBaseProps {}

export function ToastCloseTrigger(props: ToastCloseTriggerProps) {
  const toast = useToastContext()
  const mergedProps = mergeProps(() => toast().getCloseTriggerProps(), props)

  return <ui.button {...mergedProps} />
}
