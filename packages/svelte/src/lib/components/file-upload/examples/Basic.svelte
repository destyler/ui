<script lang="ts">
  import { FileUpload } from '../index'

  function createMockImageFile(): File {
    const data = atob('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==')
    const bytes = Uint8Array.from(data, (character) => character.charCodeAt(0))
    return new File([bytes], 'test-image.png', { type: 'image/png' })
  }

  const mockImageFile = createMockImageFile()
</script>

<FileUpload.Root>
  <FileUpload.Dropzone>
    <FileUpload.Label>Drag your file(s) here</FileUpload.Label>
  </FileUpload.Dropzone>
  <FileUpload.Trigger>Choose file(s)</FileUpload.Trigger>
  <FileUpload.ClearTrigger>Clear</FileUpload.ClearTrigger>
  <FileUpload.ItemGroup>
    <FileUpload.Context>
      {#snippet render(api)}
        {#each api().acceptedFiles as file (`${file.name}-${file.lastModified}`)}
          <FileUpload.Item {file}>
            <FileUpload.ItemPreview>
              <FileUpload.ItemPreviewImage />
            </FileUpload.ItemPreview>
            <FileUpload.ItemName>{file.name}</FileUpload.ItemName>
            <FileUpload.ItemSizeText>{api().getFileSize(file)}</FileUpload.ItemSizeText>
            <FileUpload.ItemDeleteTrigger>Remove</FileUpload.ItemDeleteTrigger>
          </FileUpload.Item>
        {/each}
      {/snippet}
    </FileUpload.Context>
    <FileUpload.Item file={mockImageFile}>
      <FileUpload.ItemPreview>
        <FileUpload.ItemPreviewImage />
      </FileUpload.ItemPreview>
      <FileUpload.ItemName>{mockImageFile.name}</FileUpload.ItemName>
      <FileUpload.ItemSizeText>1 KB</FileUpload.ItemSizeText>
      <FileUpload.ItemDeleteTrigger>Remove</FileUpload.ItemDeleteTrigger>
    </FileUpload.Item>
  </FileUpload.ItemGroup>
  <FileUpload.HiddenInput />
</FileUpload.Root>
