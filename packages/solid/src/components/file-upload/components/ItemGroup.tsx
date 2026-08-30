import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useFileUploadContext } from '../hooks/use-file-upload-context'

export interface FileUploadItemGroupBaseProps extends PolymorphicProps<'ul'> {}
export interface FileUploadItemGroupProps extends HTMLProps<'ul'>, FileUploadItemGroupBaseProps {}

export function FileUploadItemGroup(props: FileUploadItemGroupProps) {
  const fileUpload = useFileUploadContext()
  const mergedProps = mergeProps(() => fileUpload().getItemGroupProps(), props)

  return <ui.ul {...mergedProps} />
}
