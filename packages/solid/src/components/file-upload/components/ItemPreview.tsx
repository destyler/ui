import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { Show, splitProps } from 'solid-js'
import { ui } from '~/factory'
import { useFileUploadContext } from '../hooks/use-file-upload-context'
import { useFileUploadItemPropsContext } from '../hooks/use-file-upload-item-props-context'

export interface FileUploadItemPreviewBaseProps extends PolymorphicProps<'div'> {
  /**
   * The file type to match against. Matches all file types by default.
   * @default '.*'
   */
  type?: string
}
export interface FileUploadItemPreviewProps
  extends HTMLProps<'div'>,
  FileUploadItemPreviewBaseProps {}

export function FileUploadItemPreview(props: FileUploadItemPreviewProps) {
  const [previewProps, localProps] = splitProps(props, ['type'])
  const fileUpload = useFileUploadContext()
  const itemProps = useFileUploadItemPropsContext()
  const mergedProps = mergeProps(() => fileUpload().getItemPreviewProps(itemProps), localProps)

  return (
    <Show when={itemProps.file.type.match(previewProps.type ?? '.*')}>
      <ui.div {...mergedProps} />
    </Show>
  )
}
