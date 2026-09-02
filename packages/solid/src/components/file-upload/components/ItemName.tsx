import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { orFallback } from '~/utils/or-fallback'
import { useFileUploadContext } from '../hooks/use-file-upload-context'
import { useFileUploadItemPropsContext } from '../hooks/use-file-upload-item-props-context'

export interface FileUploadItemNameBaseProps extends PolymorphicProps<'div'> {}
export interface FileUploadItemNameProps extends HTMLProps<'div'>, FileUploadItemNameBaseProps {}

export function FileUploadItemName(props: FileUploadItemNameProps) {
  const fileUpload = useFileUploadContext()
  const itemProps = useFileUploadItemPropsContext()
  const mergedProps = mergeProps(() => fileUpload().getItemNameProps(itemProps), props)

  return <ui.div {...mergedProps}>{orFallback(props.children, itemProps.file.name)}</ui.div>
}
