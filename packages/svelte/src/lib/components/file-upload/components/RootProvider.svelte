<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'
  import type { UseFileUploadReturn } from '../hooks/use-file-upload.svelte'

  interface RootProviderProps {
    value: UseFileUploadReturn
  }

  export interface FileUploadRootProviderBaseProps extends RootProviderProps, PolymorphicProps<'div'> {}
  export interface FileUploadRootProviderProps extends Assign<HTMLProps<'div'>, FileUploadRootProviderBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { FileUploadProvider } from '../hooks/use-file-upload-context'

  const { value, ...props }: FileUploadRootProviderProps = $props()
  const mergedProps = $derived(mergeProps(value().getRootProps(), props))

  FileUploadProvider(() => value())
</script>

<UI as="div" {...mergedProps} />
