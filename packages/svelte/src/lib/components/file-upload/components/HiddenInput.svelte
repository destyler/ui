<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface FileUploadHiddenInputBaseProps extends PolymorphicProps<'input'> {}
  export interface FileUploadHiddenInputProps extends Assign<HTMLProps<'input'>, FileUploadHiddenInputBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useFieldContext } from '../../field'
  import { useFileUploadContext } from '../hooks/use-file-upload-context'

  const props: FileUploadHiddenInputProps = $props()
  const fileUpload = useFileUploadContext()
  const field = useFieldContext()
  const mergedProps = $derived(mergeProps(fileUpload().getHiddenInputProps(), props))
</script>

<UI as="input" aria-describedby={field?.()?.ariaDescribedby} {...mergedProps} />
