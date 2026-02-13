import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useFileUploadContext } from '../hooks/use-file-upload-context'
import { useFileUploadItemPropsContext } from '../hooks/use-file-upload-item-props-context'

export interface FileUploadItemPreviewBaseProps extends PolymorphicProps {
  /**
   * The file type to match against. Matches all file types by default.
   * @default '.*'
   */
  type?: string
}
export interface FileUploadItemPreviewProps extends HTMLProps<'div'>, FileUploadItemPreviewBaseProps {}

export const FileUploadItemPreview = forwardRef<HTMLImageElement, FileUploadItemPreviewProps>((props, ref) => {
  const fileUpload = useFileUploadContext()
  const itemProps = useFileUploadItemPropsContext()
  const mergedProps = mergeProps(fileUpload.getItemPreviewProps(itemProps), props)

  if (!itemProps.file.type.match(props.type ?? '.*'))
    return null

  return <ui.div {...mergedProps} ref={ref} />
})

FileUploadItemPreview.displayName = 'FileUploadItemPreview'
