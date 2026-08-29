<script module lang="ts">
  import type { Assign, HTMLProps, Optional, PolymorphicProps } from '$lib/types'
  import type { UseFileUploadProps } from '../hooks/use-file-upload.svelte'

  export interface FileUploadRootBaseProps extends Optional<UseFileUploadProps, 'id'>, PolymorphicProps<'div'> {}
  export interface FileUploadRootProps extends Assign<HTMLProps<'div'>, FileUploadRootBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { createSplitProps } from '../../../utils/create-split-props'
  import { UI } from '../../factory'
  import { FileUploadProvider } from '../hooks/use-file-upload-context'
  import { useFileUpload } from '../hooks/use-file-upload.svelte'

  const props: FileUploadRootProps = $props()
  const providedId = $props.id()

  const [useFileUploadProps, localProps] = $derived(
    createSplitProps<Optional<UseFileUploadProps, 'id'>>()(props, [
      'accept',
      'allowDrop',
      'capture',
      'directory',
      'disabled',
      'id',
      'ids',
      'invalid',
      'locale',
      'maxFiles',
      'maxFileSize',
      'minFileSize',
      'name',
      'onFileAccept',
      'onFileChange',
      'onFileReject',
      'preventDocumentDrop',
      'required',
      'translations',
      'validate',
    ]),
  )

  const resolvedProps = $derived<UseFileUploadProps>({
    ...useFileUploadProps,
    id: useFileUploadProps.id ?? providedId,
  })

  const fileUpload = useFileUpload(() => resolvedProps)
  const mergedProps = $derived(mergeProps(fileUpload().getRootProps(), localProps))

  FileUploadProvider(() => fileUpload())
</script>

<UI as="div" {...mergedProps} />
