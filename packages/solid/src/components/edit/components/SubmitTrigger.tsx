import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useEditContext } from '../hooks/use-edit-context'

export interface EditSubmitTriggerBaseProps extends PolymorphicProps<'button'> {}
export interface EditSubmitTriggerProps
  extends HTMLProps<'button'>,
  EditSubmitTriggerBaseProps {}

export function EditSubmitTrigger(props: EditSubmitTriggerProps) {
  const api = useEditContext()
  const mergedProps = mergeProps(() => api().getSubmitTriggerProps(), props)

  return <ui.button {...mergedProps} />
}
