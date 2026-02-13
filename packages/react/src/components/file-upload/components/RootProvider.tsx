import type { UseFileUploadReturn } from '../hooks/use-file-upload'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { FileUploadProvider } from '../hooks/use-file-upload-context'

interface RootProviderProps {
  value: UseFileUploadReturn
}

export interface FileUploadRootProviderBaseProps extends RootProviderProps, PolymorphicProps {}
export interface FileUploadRootProviderProps extends HTMLProps<'div'>, FileUploadRootProviderBaseProps {}

export const FileUploadRootProvider = forwardRef<HTMLDivElement, FileUploadRootProviderProps>((props, ref) => {
  const [{ value: fileUpload }, localProps] = createSplitProps<RootProviderProps>()(props, ['value'])
  const mergedProps = mergeProps(fileUpload.getRootProps(), localProps)

  return (
    <FileUploadProvider value={fileUpload}>
      <ui.div {...mergedProps} ref={ref} />
    </FileUploadProvider>
  )
})

FileUploadRootProvider.displayName = 'FileUploadRootProvider'
