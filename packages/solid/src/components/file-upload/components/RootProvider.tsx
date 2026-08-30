import type { UseFileUploadReturn } from '../hooks/use-file-upload'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { FileUploadProvider } from '../hooks/use-file-upload-context'

interface RootProviderProps {
  value: UseFileUploadReturn
}

export interface FileUploadRootProviderBaseProps extends PolymorphicProps<'div'> {}
export interface FileUploadRootProviderProps
  extends HTMLProps<'div'>,
  RootProviderProps,
  FileUploadRootProviderBaseProps {}

export function FileUploadRootProvider(props: FileUploadRootProviderProps) {
  const [providerProps, localProps] = createSplitProps<RootProviderProps>()(props, [
    'value',
  ])
  const fileUpload = () => providerProps.value()
  const mergedProps = mergeProps(() => fileUpload().getRootProps(), localProps)

  return (
    <FileUploadProvider value={fileUpload}>
      <ui.div {...mergedProps} />
    </FileUploadProvider>
  )
}
