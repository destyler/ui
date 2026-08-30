import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useFileUploadContext } from '../hooks/use-file-upload-context'
import { useFileUploadItemPropsContext } from '../hooks/use-file-upload-item-props-context'

export interface FileUploadItemSizeTextBaseProps extends PolymorphicProps<'div'> {}
export interface FileUploadItemSizeTextProps
  extends HTMLProps<'div'>,
  FileUploadItemSizeTextBaseProps {}

export function FileUploadItemSizeText(props: FileUploadItemSizeTextProps) {
  const fileUpload = useFileUploadContext()
  const itemProps = useFileUploadItemPropsContext()
  const mergedProps = mergeProps(() => fileUpload().getItemSizeTextProps(itemProps), props)

  return (
    <ui.div {...mergedProps}>{props.children || fileUpload().getFileSize(itemProps.file)}</ui.div>
  )
}
