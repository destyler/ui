import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useFileUploadContext } from '../hooks/use-file-upload-context'
import { useFileUploadItemPropsContext } from '../hooks/use-file-upload-item-props-context'

export interface FileUploadItemDeleteTriggerBaseProps extends PolymorphicProps<'button'> {}
export interface FileUploadItemDeleteTriggerProps
  extends HTMLProps<'button'>,
  FileUploadItemDeleteTriggerBaseProps {}

export function FileUploadItemDeleteTrigger(props: FileUploadItemDeleteTriggerProps) {
  const fileUpload = useFileUploadContext()
  const itemProps = useFileUploadItemPropsContext()
  const mergedProps = mergeProps(() => fileUpload().getItemDeleteTriggerProps(itemProps), props)

  return <ui.button {...mergedProps} />
}
