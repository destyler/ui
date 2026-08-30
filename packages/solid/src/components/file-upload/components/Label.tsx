import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useFileUploadContext } from '../hooks/use-file-upload-context'

export interface FileUploadLabelBaseProps extends PolymorphicProps<'label'> {}
export interface FileUploadLabelProps extends HTMLProps<'label'>, FileUploadLabelBaseProps {}

export function FileUploadLabel(props: FileUploadLabelProps) {
  const fileUpload = useFileUploadContext()
  const mergedProps = mergeProps(() => fileUpload().getLabelProps(), props)

  return <ui.label {...mergedProps} />
}
