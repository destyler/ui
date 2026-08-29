<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface FileUploadItemSizeTextBaseProps extends PolymorphicProps<'div'> {}
  export interface FileUploadItemSizeTextProps extends Assign<HTMLProps<'div'>, FileUploadItemSizeTextBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useFileUploadContext } from '../hooks/use-file-upload-context'
  import { useFileUploadItemPropsContext } from '../hooks/use-file-upload-item-props-context'

  const props: FileUploadItemSizeTextProps = $props()
  const fileUpload = useFileUploadContext()
  const itemProps = useFileUploadItemPropsContext()
  const mergedProps = $derived(mergeProps(fileUpload().getItemSizeTextProps(itemProps()), props))
</script>

<UI as="div" {...mergedProps}>
  {#if props.children}
    {@render props.children?.()}
  {:else}
    {fileUpload().getFileSize(itemProps().file)}
  {/if}
</UI>
