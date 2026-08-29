<script module lang="ts">
  import type { ItemProps } from '@destyler/file-upload'
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface FileUploadItemBaseProps extends ItemProps, PolymorphicProps<'li'> {}
  export interface FileUploadItemProps extends Assign<HTMLProps<'li'>, FileUploadItemBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { createSplitProps } from '../../../utils/create-split-props'
  import { UI } from '../../factory'
  import { useFileUploadContext } from '../hooks/use-file-upload-context'
  import { FileUploadItemPropsProvider } from '../hooks/use-file-upload-item-props-context'

  const props: FileUploadItemProps = $props()
  const fileUpload = useFileUploadContext()

  const [itemProps, localProps] = $derived(createSplitProps<ItemProps>()(props, ['file']))

  const mergedProps = $derived(mergeProps(fileUpload().getItemProps(itemProps), localProps))

  FileUploadItemPropsProvider(() => itemProps)
</script>

<UI as="li" {...mergedProps} />
