import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useEditContext } from '../hooks/use-edit-context'

export interface EditLabelBaseProps extends PolymorphicProps<'label'> {}
export interface EditLabelProps extends HTMLProps<'label'>, EditLabelBaseProps {}

export function EditLabel(props: EditLabelProps) {
  const api = useEditContext()
  const mergedProps = mergeProps(() => api().getLabelProps(), props)

  return <ui.label {...mergedProps} />
}
