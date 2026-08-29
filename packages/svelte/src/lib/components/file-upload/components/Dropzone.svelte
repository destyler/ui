<script module lang="ts">
  import type { DropzoneProps } from '@destyler/file-upload'
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface FileUploadDropzoneBaseProps extends PolymorphicProps<'div'>, DropzoneProps {}
  export interface FileUploadDropzoneProps extends Assign<HTMLProps<'div'>, FileUploadDropzoneBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { createSplitProps } from '../../../utils/create-split-props'
  import { UI } from '../../factory'
  import { useFileUploadContext } from '../hooks/use-file-upload-context'

  const props: FileUploadDropzoneProps = $props()
  const fileUpload = useFileUploadContext()

  const [dropzoneProps, localProps] = $derived(createSplitProps<DropzoneProps>()(props, ['disableClick']))

  const mergedProps = $derived(mergeProps(fileUpload().getDropzoneProps(dropzoneProps), localProps))
</script>

<UI as="div" {...mergedProps} />
