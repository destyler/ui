import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useEditContext } from '../hooks/use-edit-context'

export interface EditControlBaseProps extends PolymorphicProps<'div'> {}
export interface EditControlProps extends HTMLProps<'div'>, EditControlBaseProps {}

export function EditControl(props: EditControlProps) {
  const api = useEditContext()
  const mergedProps = mergeProps(() => api().getControlProps(), props)

  return <ui.div {...mergedProps} />
}
