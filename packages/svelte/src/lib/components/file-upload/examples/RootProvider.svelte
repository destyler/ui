<script lang="ts">
  import { FileUpload, useFileUpload } from '../index'

  const id = $props.id()
  const fileUpload = useFileUpload({ id, maxFiles: 5 })
</script>

<button type="button" onclick={() => fileUpload().clearFiles()}>Clear</button>

<FileUpload.RootProvider value={fileUpload}>
  <FileUpload.Label>File Upload</FileUpload.Label>
  <FileUpload.Dropzone>Drop your files here</FileUpload.Dropzone>
  <FileUpload.Trigger>Choose file(s)</FileUpload.Trigger>
  <FileUpload.ItemGroup>
    <FileUpload.Context>
      {#snippet render(api)}
        {#each api().acceptedFiles as file (`${file.name}-${file.lastModified}`)}
          <FileUpload.Item {file}>
            <FileUpload.ItemPreview type="image/*">
              <FileUpload.ItemPreviewImage />
            </FileUpload.ItemPreview>
            <FileUpload.ItemPreview type=".*"><div>Generic Icon</div></FileUpload.ItemPreview>
            <FileUpload.ItemName />
            <FileUpload.ItemSizeText />
            <FileUpload.ItemDeleteTrigger>X</FileUpload.ItemDeleteTrigger>
          </FileUpload.Item>
        {/each}
      {/snippet}
    </FileUpload.Context>
  </FileUpload.ItemGroup>
  <FileUpload.HiddenInput />
</FileUpload.RootProvider>
