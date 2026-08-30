import type { UseFileUploadProps } from '../hooks/use-file-upload'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useFileUpload } from '../hooks/use-file-upload'
import { FileUploadProvider } from '../hooks/use-file-upload-context'

export interface FileUploadRootBaseProps extends UseFileUploadProps, PolymorphicProps<'div'> {}
export interface FileUploadRootProps extends HTMLProps<'div'>, FileUploadRootBaseProps {}

export function FileUploadRoot(props: FileUploadRootProps) {
  const [fileUploadProps, localProps] = createSplitProps<UseFileUploadProps>()(props, [
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

  const fileUpload = useFileUpload(fileUploadProps)
  const mergedProps = mergeProps(() => fileUpload().getRootProps(), localProps)

  return (
    <FileUploadProvider value={fileUpload}>
      <ui.div {...mergedProps} />
    </FileUploadProvider>
  )
}
