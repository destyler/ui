import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useFileUploadContext } from '../hooks/use-file-upload-context'

export interface FileUploadClearTriggerBaseProps extends PolymorphicProps<'button'> {}
export interface FileUploadClearTriggerProps
  extends HTMLProps<'button'>,
  FileUploadClearTriggerBaseProps {}

export function FileUploadClearTrigger(props: FileUploadClearTriggerProps) {
  const fileUpload = useFileUploadContext()
  const mergedProps = mergeProps(() => fileUpload().getClearTriggerProps(), props)

  return <ui.button {...mergedProps} />
}
