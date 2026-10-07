<script lang="ts">
  import { untrack } from 'svelte'
  import type { UseFileUploadProps } from '../hooks/use-file-upload.svelte'
  import { FileUpload, useFileUpload } from '../index'
  let { initialProps = {} }: { initialProps?: Partial<UseFileUploadProps> } = $props()
  let options = $state<UseFileUploadProps>({ id: 'files', preventDocumentDrop: false, ...untrack(() => initialProps) })
  const api = useFileUpload(() => options)
  export const getApi = () => api()
  export function update(next: Partial<UseFileUploadProps>) { options = { ...options, ...next } }
</script>
<FileUpload.RootProvider value={api}>
  <FileUpload.Label>Attachments</FileUpload.Label>
  <FileUpload.HiddenInput />
  {#each api().acceptedFiles as file, index (index)}
    <FileUpload.Item {file}>
      <FileUpload.ItemPreviewImage />
      <FileUpload.ItemName />
    </FileUpload.Item>
  {/each}
</FileUpload.RootProvider>
