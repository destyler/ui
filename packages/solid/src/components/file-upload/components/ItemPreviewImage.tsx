import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { createEffect, createSignal, onCleanup, Show } from 'solid-js'
import { ui } from '~/factory'
import { useFileUploadContext } from '../hooks/use-file-upload-context'
import { useFileUploadItemPropsContext } from '../hooks/use-file-upload-item-props-context'

export interface FileUploadItemPreviewImageBaseProps extends PolymorphicProps<'img'> {}
export interface FileUploadItemPreviewImageProps
  extends HTMLProps<'img'>,
  FileUploadItemPreviewImageBaseProps {}

export function FileUploadItemPreviewImage(props: FileUploadItemPreviewImageProps) {
  const fileUpload = useFileUploadContext()
  const itemProps = useFileUploadItemPropsContext()
  const [url, setUrl] = createSignal<string>('')

  createEffect(() => {
    const cleanup = fileUpload().createFileUrl(itemProps.file, url => setUrl(url))
    onCleanup(cleanup)
  })

  const mergedProps = mergeProps(
    () => fileUpload().getItemPreviewImageProps({ ...itemProps, url: url() }),
    props,
  )

  return (
    <Show when={url()}>
      <ui.img {...mergedProps} />
    </Show>
  )
}
