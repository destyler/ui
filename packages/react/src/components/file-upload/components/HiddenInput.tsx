import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { useFieldContext } from '~/components/field'
import { ui } from '~/factory'
import { useFileUploadContext } from '../hooks/use-file-upload-context'

export interface FileUploadHiddenInputBaseProps extends PolymorphicProps {}
export interface FileUploadHiddenInputProps extends HTMLProps<'input'>, FileUploadHiddenInputBaseProps {}

export const FileUploadHiddenInput = forwardRef<HTMLInputElement, FileUploadHiddenInputProps>((props, ref) => {
  const fileUpload = useFileUploadContext()
  const mergedProps = mergeProps(fileUpload.getHiddenInputProps(), props)
  const field = useFieldContext()

  return <ui.input aria-describedby={field?.ariaDescribedby} {...mergedProps} ref={ref} />
})

FileUploadHiddenInput.displayName = 'FileUploadHiddenInput'
