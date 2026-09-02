import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useEditContext } from '../hooks/use-edit-context'

export interface EditCancelTriggerBaseProps extends PolymorphicProps<'button'> {}
export interface EditCancelTriggerProps
  extends HTMLProps<'button'>,
  EditCancelTriggerBaseProps {}

export function EditCancelTrigger(props: EditCancelTriggerProps) {
  const api = useEditContext()
  const mergedProps = mergeProps(() => api().getCancelTriggerProps(), props)

  return <ui.button {...mergedProps} />
}
