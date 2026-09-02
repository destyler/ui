import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { useFieldContext } from '~/components/field'
import { ui } from '~/factory'
import { useFileUploadContext } from '../hooks/use-file-upload-context'

export interface FileUploadHiddenInputBaseProps extends PolymorphicProps<'input'> {}
export interface FileUploadHiddenInputProps
  extends HTMLProps<'input'>,
  FileUploadHiddenInputBaseProps {}

export function FileUploadHiddenInput(props: FileUploadHiddenInputProps) {
  const fileUpload = useFileUploadContext()
  const mergedProps = mergeProps(() => fileUpload().getHiddenInputProps(), props)
  const field = useFieldContext()

  return <ui.input aria-describedby={field?.().ariaDescribedby} {...mergedProps} />
}
