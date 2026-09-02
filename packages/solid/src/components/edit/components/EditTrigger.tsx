import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useEditContext } from '../hooks/use-edit-context'

export interface EditEditTriggerBaseProps extends PolymorphicProps<'button'> {}
export interface EditEditTriggerProps
  extends HTMLProps<'button'>,
  EditEditTriggerBaseProps {}

export function EditEditTrigger(props: EditEditTriggerProps) {
  const api = useEditContext()
  const mergedProps = mergeProps(() => api().getEditTriggerProps(), props)

  return <ui.button {...mergedProps} />
}
