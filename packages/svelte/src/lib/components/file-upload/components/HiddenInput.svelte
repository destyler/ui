<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface FileUploadHiddenInputBaseProps extends PolymorphicProps<'input'> {}
  export interface FileUploadHiddenInputProps extends Assign<HTMLProps<'input'>, FileUploadHiddenInputBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useFileUploadContext } from '../hooks/use-file-upload-context'

  const props: FileUploadHiddenInputProps = $props()
  const fileUpload = useFileUploadContext()
  const mergedProps = $derived(mergeProps(fileUpload().getHiddenInputProps(), props))
</script>

<UI as="input" {...mergedProps} />
