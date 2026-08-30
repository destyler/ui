import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useEditContext } from '../hooks/use-edit-context'

export interface EditAreaBaseProps extends PolymorphicProps<'div'> {}
export interface EditAreaProps extends HTMLProps<'div'>, EditAreaBaseProps {}

export function EditArea(props: EditAreaProps) {
  const api = useEditContext()
  const mergedProps = mergeProps(() => api().getAreaProps(), props)

  return <ui.div {...mergedProps} />
}
