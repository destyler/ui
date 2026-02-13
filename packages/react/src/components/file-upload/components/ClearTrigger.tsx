import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useFileUploadContext } from '../hooks/use-file-upload-context'

export interface FileUploadClearTriggerBaseProps extends PolymorphicProps {}
export interface FileUploadClearTriggerProps extends HTMLProps<'button'>, FileUploadClearTriggerBaseProps {}

export const FileUploadClearTrigger = forwardRef<HTMLButtonElement, FileUploadClearTriggerProps>((props, ref) => {
  const fileUpload = useFileUploadContext()
  const mergedProps = mergeProps(fileUpload.getClearTriggerProps(), props)

  return <ui.button {...mergedProps} ref={ref} />
})

FileUploadClearTrigger.displayName = 'FileUploadClearTrigger'
