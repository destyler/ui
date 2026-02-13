import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useFileUploadContext } from '../hooks/use-file-upload-context'
import { useFileUploadItemPropsContext } from '../hooks/use-file-upload-item-props-context'

export interface FileUploadItemSizeTextBaseProps extends PolymorphicProps {}
export interface FileUploadItemSizeTextProps extends HTMLProps<'div'>, FileUploadItemSizeTextBaseProps {}

export const FileUploadItemSizeText = forwardRef<HTMLDivElement, FileUploadItemSizeTextProps>((props, ref) => {
  const { children, ...rest } = props
  const fileUpload = useFileUploadContext()
  const itemProps = useFileUploadItemPropsContext()
  const mergedProps = mergeProps(fileUpload.getItemSizeTextProps(itemProps), rest)

  return (
    <ui.div {...mergedProps} ref={ref}>
      {children || fileUpload.getFileSize(itemProps.file)}
    </ui.div>
  )
})

FileUploadItemSizeText.displayName = 'FileUploadItemSizeText'
