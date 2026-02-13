import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef, useEffect, useState } from 'react'
import { ui } from '~/factory'
import { useFileUploadContext } from '../hooks/use-file-upload-context'
import { useFileUploadItemPropsContext } from '../hooks/use-file-upload-item-props-context'

export interface FileUploadItemPreviewImageBaseProps extends PolymorphicProps {}
export interface FileUploadItemPreviewImageProps extends HTMLProps<'img'>, FileUploadItemPreviewImageBaseProps {}

export const FileUploadItemPreviewImage = forwardRef<HTMLImageElement, FileUploadItemPreviewImageProps>(
  (props, ref) => {
    const [url, setUrl] = useState<string>('')
    const fileUpload = useFileUploadContext()
    const itemProps = useFileUploadItemPropsContext()
    const mergedProps = mergeProps(fileUpload.getItemPreviewImageProps({ ...itemProps, url }), props)

    useEffect(() => {
      return fileUpload.createFileUrl(itemProps.file, url => setUrl(url))
    }, [itemProps, fileUpload])

    if (!url)
      return null

    return <ui.img {...mergedProps} ref={ref} />
  },
)

FileUploadItemPreviewImage.displayName = 'FileUploadItemPreviewImage'
