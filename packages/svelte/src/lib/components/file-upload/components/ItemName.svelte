<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface FileUploadItemNameBaseProps extends PolymorphicProps<'div'> {}
  export interface FileUploadItemNameProps extends Assign<HTMLProps<'div'>, FileUploadItemNameBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useFileUploadContext } from '../hooks/use-file-upload-context'
  import { useFileUploadItemPropsContext } from '../hooks/use-file-upload-item-props-context'

  const props: FileUploadItemNameProps = $props()
  const fileUpload = useFileUploadContext()
  const itemProps = useFileUploadItemPropsContext()
  const mergedProps = $derived(mergeProps(fileUpload().getItemNameProps(itemProps()), props))
</script>

<UI as="div" {...mergedProps}>
  {#if props.children}
    {@render props.children?.()}
  {:else}
    {itemProps().file.name}
  {/if}
</UI>
