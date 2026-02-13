import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useFileUploadContext } from '../hooks/use-file-upload-context'

export interface FileUploadItemGroupBaseProps extends PolymorphicProps {}
export interface FileUploadItemGroupProps extends HTMLProps<'ul'>, FileUploadItemGroupBaseProps {}

export const FileUploadItemGroup = forwardRef<HTMLUListElement, FileUploadItemGroupProps>((props, ref) => {
  const fileUpload = useFileUploadContext()
  const mergedProps = mergeProps(fileUpload.getItemGroupProps(), props)

  return <ui.ul {...mergedProps} ref={ref} />
})

FileUploadItemGroup.displayName = 'FileUploadItemGroup'
