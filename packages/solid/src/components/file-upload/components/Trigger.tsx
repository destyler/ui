import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useFileUploadContext } from '../hooks/use-file-upload-context'

export interface FileUploadTriggerBaseProps extends PolymorphicProps<'button'> {}
export interface FileUploadTriggerProps extends HTMLProps<'button'>, FileUploadTriggerBaseProps {}

export function FileUploadTrigger(props: FileUploadTriggerProps) {
  const fileUpload = useFileUploadContext()
  const mergedProps = mergeProps(() => fileUpload().getTriggerProps(), props)

  return <ui.button {...mergedProps} />
}
