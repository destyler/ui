import type { UseFileUploadProps } from '../hooks/use-file-upload'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useFileUpload } from '../hooks/use-file-upload'
import { FileUploadProvider } from '../hooks/use-file-upload-context'

export interface FileUploadRootBaseProps extends UseFileUploadProps, PolymorphicProps {}
export interface FileUploadRootProps extends HTMLProps<'div'>, FileUploadRootBaseProps {}

export const FileUploadRoot = forwardRef<HTMLDivElement, FileUploadRootProps>((props, ref) => {
  const [useFileUploadProps, localProps] = createSplitProps<UseFileUploadProps>()(props, [
    'accept',
    'allowDrop',
    'capture',
    'directory',
    'disabled',
    'id',
    'ids',
    'invalid',
    'locale',
    'maxFiles',
    'maxFileSize',
    'minFileSize',
    'name',
    'onFileAccept',
    'onFileChange',
    'onFileReject',
    'preventDocumentDrop',
    'required',
    'translations',
    'validate',
  ])
  const fileUpload = useFileUpload(useFileUploadProps)
  const mergedProps = mergeProps(fileUpload.getRootProps(), localProps)

  return (
    <FileUploadProvider value={fileUpload}>
      <ui.div {...mergedProps} ref={ref} />
    </FileUploadProvider>
  )
})

FileUploadRoot.displayName = 'FileUploadRoot'
