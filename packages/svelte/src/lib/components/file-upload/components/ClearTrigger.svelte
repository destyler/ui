<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface FileUploadClearTriggerBaseProps extends PolymorphicProps<'button'> {}
  export interface FileUploadClearTriggerProps extends Assign<HTMLProps<'button'>, FileUploadClearTriggerBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useFileUploadContext } from '../hooks/use-file-upload-context'

  const props: FileUploadClearTriggerProps = $props()
  const fileUpload = useFileUploadContext()
  const mergedProps = $derived(mergeProps(fileUpload().getClearTriggerProps(), props))
</script>

<UI as="button" {...mergedProps} />
