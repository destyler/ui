import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useFileUploadContext } from '../hooks/use-file-upload-context'

export interface FileUploadLabelBaseProps extends PolymorphicProps {}
export interface FileUploadLabelProps extends HTMLProps<'label'>, FileUploadLabelBaseProps {}

export const FileUploadLabel = forwardRef<HTMLLabelElement, FileUploadLabelProps>((props, ref) => {
  const fileUpload = useFileUploadContext()
  const mergedProps = mergeProps(fileUpload.getLabelProps(), props)

  return <ui.label {...mergedProps} ref={ref} />
})

FileUploadLabel.displayName = 'FileUploadLabel'
