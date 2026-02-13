import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useFileUploadContext } from '../hooks/use-file-upload-context'
import { useFileUploadItemPropsContext } from '../hooks/use-file-upload-item-props-context'

export interface FileUploadItemDeleteTriggerBaseProps extends PolymorphicProps {}
export interface FileUploadItemDeleteTriggerProps extends HTMLProps<'button'>, FileUploadItemDeleteTriggerBaseProps {}

export const FileUploadItemDeleteTrigger = forwardRef<HTMLButtonElement, FileUploadItemDeleteTriggerProps>(
  (props, ref) => {
    const fileUpload = useFileUploadContext()
    const itemProps = useFileUploadItemPropsContext()
    const mergedProps = mergeProps(fileUpload.getItemDeleteTriggerProps(itemProps), props)

    return <ui.button {...mergedProps} ref={ref} />
  },
)

FileUploadItemDeleteTrigger.displayName = 'FileUploadItemDeleteTrigger'
