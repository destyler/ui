import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useFileUploadContext } from '../hooks/use-file-upload-context'
import { useFileUploadItemPropsContext } from '../hooks/use-file-upload-item-props-context'

export interface FileUploadItemNameBaseProps extends PolymorphicProps {}
export interface FileUploadItemNameProps extends HTMLProps<'div'>, FileUploadItemNameBaseProps {}

export const FileUploadItemName = forwardRef<HTMLDivElement, FileUploadItemNameProps>((props, ref) => {
  const { children, ...rest } = props
  const fileUpload = useFileUploadContext()
  const itemProps = useFileUploadItemPropsContext()
  const mergedProps = mergeProps(fileUpload.getItemNameProps(itemProps), rest)

  return (
    <ui.div {...mergedProps} ref={ref}>
      {children || itemProps.file.name}
    </ui.div>
  )
})

FileUploadItemName.displayName = 'FileUploadItemName'
