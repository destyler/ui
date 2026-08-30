import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useEditContext } from '../hooks/use-edit-context'

export interface EditPreviewBaseProps extends PolymorphicProps<'span'> {}
export interface EditPreviewProps extends HTMLProps<'span'>, EditPreviewBaseProps {}

export function EditPreview(props: EditPreviewProps) {
  const api = useEditContext()
  const mergedProps = mergeProps(() => api().getPreviewProps(), props)

  return <ui.span {...mergedProps} />
}
