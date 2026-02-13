import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useFileUploadContext } from '../hooks/use-file-upload-context'

export interface FileUploadTriggerBaseProps extends PolymorphicProps {}
export interface FileUploadTriggerProps extends HTMLProps<'button'>, FileUploadTriggerBaseProps {}

export const FileUploadTrigger = forwardRef<HTMLButtonElement, FileUploadTriggerProps>((props, ref) => {
  const fileUpload = useFileUploadContext()
  const mergedProps = mergeProps(fileUpload.getTriggerProps(), props)

  return <ui.button {...mergedProps} ref={ref} />
})

FileUploadTrigger.displayName = 'FileUploadTrigger'
