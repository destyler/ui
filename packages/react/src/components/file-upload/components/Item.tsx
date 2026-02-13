import type { ItemProps } from '@destyler/file-upload'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useFileUploadContext } from '../hooks/use-file-upload-context'
import { FileUploadItemPropsProvider } from '../hooks/use-file-upload-item-props-context'

export interface FileUploadItemBaseProps extends ItemProps, PolymorphicProps {}
export interface FileUploadItemProps extends HTMLProps<'li'>, FileUploadItemBaseProps {}

export const FileUploadItem = forwardRef<HTMLLIElement, FileUploadItemProps>((props, ref) => {
  const [itemProps, localProps] = createSplitProps<ItemProps>()(props, ['file'])
  const fileUpload = useFileUploadContext()
  const mergedProps = mergeProps(fileUpload.getItemProps(itemProps), localProps)

  return (
    <FileUploadItemPropsProvider value={itemProps}>
      <ui.li {...mergedProps} ref={ref} />
    </FileUploadItemPropsProvider>
  )
})

FileUploadItem.displayName = 'FileUploadItem'
