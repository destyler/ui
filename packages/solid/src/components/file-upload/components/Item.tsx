import type { ItemProps } from '@destyler/file-upload'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useFileUploadContext } from '../hooks/use-file-upload-context'
import { FileUploadItemPropsProvider } from '../hooks/use-file-upload-item-props-context'

export interface FileUploadItemBaseProps extends ItemProps, PolymorphicProps<'li'> {}
export interface FileUploadItemProps extends HTMLProps<'li'>, FileUploadItemBaseProps {}

export function FileUploadItem(props: FileUploadItemProps) {
  const [itemProps, localProps] = createSplitProps<ItemProps>()(props, ['file'])
  const fileUpload = useFileUploadContext()
  const mergedProps = mergeProps(() => fileUpload().getItemProps(itemProps), localProps)

  return (
    <FileUploadItemPropsProvider value={itemProps}>
      <ui.li {...mergedProps} />
    </FileUploadItemPropsProvider>
  )
}
