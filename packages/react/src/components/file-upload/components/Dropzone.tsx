import type { DropzoneProps } from '@destyler/file-upload'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useFileUploadContext } from '../hooks/use-file-upload-context'

export interface FileUploadDropzoneBaseProps extends PolymorphicProps, DropzoneProps {}
export interface FileUploadDropzoneProps extends HTMLProps<'div'>, FileUploadDropzoneBaseProps {}

export const FileUploadDropzone = forwardRef<HTMLDivElement, FileUploadDropzoneProps>((props, ref) => {
  const [dropzoneProps, localProps] = createSplitProps<DropzoneProps>()(props, ['disableClick'])
  const fileUpload = useFileUploadContext()
  const mergedProps = mergeProps(fileUpload.getDropzoneProps(dropzoneProps), localProps)

  return <ui.div {...mergedProps} ref={ref} />
})

FileUploadDropzone.displayName = 'FileUploadDropzone'
