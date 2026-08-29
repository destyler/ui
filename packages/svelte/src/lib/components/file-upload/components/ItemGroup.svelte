<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface FileUploadItemGroupBaseProps extends PolymorphicProps<'ul'> {}
  export interface FileUploadItemGroupProps extends Assign<HTMLProps<'ul'>, FileUploadItemGroupBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useFileUploadContext } from '../hooks/use-file-upload-context'

  const props: FileUploadItemGroupProps = $props()
  const fileUpload = useFileUploadContext()
  const mergedProps = $derived(mergeProps(fileUpload().getItemGroupProps(), props))
</script>

<UI as="ul" {...mergedProps} />
