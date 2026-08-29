<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface FileUploadItemDeleteTriggerBaseProps extends PolymorphicProps<'button'> {}
  export interface FileUploadItemDeleteTriggerProps
    extends Assign<HTMLProps<'button'>, FileUploadItemDeleteTriggerBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useFileUploadContext } from '../hooks/use-file-upload-context'
  import { useFileUploadItemPropsContext } from '../hooks/use-file-upload-item-props-context'

  const props: FileUploadItemDeleteTriggerProps = $props()
  const fileUpload = useFileUploadContext()
  const itemProps = useFileUploadItemPropsContext()
  const mergedProps = $derived(mergeProps(fileUpload().getItemDeleteTriggerProps(itemProps()), props))
</script>

<UI as="button" {...mergedProps} />
