import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useFileUploadContext } from '../hooks/use-file-upload-context'
import { useFileUploadItemPropsContext } from '../hooks/use-file-upload-item-props-context'

export interface FileUploadItemPreviewBaseProps extends PolymorphicProps<'div'> {
  /**
   * The file type to match against. Matches all file types by default.
   * @default '.*'
   */
  type?: string
}
export interface FileUploadItemPreviewProps
  extends HTMLProps<'div'>,
  FileUploadItemPreviewBaseProps {}

export function FileUploadItemPreview(props: FileUploadItemPreviewProps) {
  const fileUpload = useFileUploadContext()
  const itemProps = useFileUploadItemPropsContext()
  const mergedProps = mergeProps(() => fileUpload().getItemPreviewProps(itemProps), props)

  if (!itemProps.file.type.match(props.type ?? '.*'))
    return null

  return <ui.div {...mergedProps} />
}
