import { useState } from 'react'
import { FileUpload } from '../index'

// Create a mock image file for testing purposes (synchronously)
function createMockImageFile(): File {
  // Create a small 1x1 transparent PNG as a base64 data URL
  const base64Data = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
  const byteCharacters = atob(base64Data)
  const byteNumbers = Array.from({ length: byteCharacters.length })
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i)
  }
  const byteArray = new Uint8Array(byteNumbers)
  const blob = new Blob([byteArray], { type: 'image/png' })
  return new File([blob], 'test-image.png', { type: 'image/png' })
}

const mockImageFile = createMockImageFile()

export function Basic() {
  const [_files, setFiles] = useState<string[]>([])

  return (
    <FileUpload.Root onFileChange={details => setFiles(details.acceptedFiles.map(f => f.name))}>
      <FileUpload.Dropzone>
        <FileUpload.Label>Drag your file(s) here</FileUpload.Label>
      </FileUpload.Dropzone>
      <FileUpload.Trigger>Choose file(s)</FileUpload.Trigger>
      <FileUpload.ClearTrigger>Clear</FileUpload.ClearTrigger>
      <FileUpload.ItemGroup>
        <FileUpload.Context>
          {api => (
            <>
              {api.acceptedFiles.map(file => (
                <FileUpload.Item key={file.name} file={file}>
                  <FileUpload.ItemPreview>
                    <FileUpload.ItemPreviewImage />
                  </FileUpload.ItemPreview>
                  <FileUpload.ItemName>{file.name}</FileUpload.ItemName>
                  <FileUpload.ItemSizeText>{api.getFileSize(file)}</FileUpload.ItemSizeText>
                  <FileUpload.ItemDeleteTrigger>Remove</FileUpload.ItemDeleteTrigger>
                </FileUpload.Item>
              ))}
            </>
          )}
        </FileUpload.Context>
        {/* Static mock item for testing to ensure all parts are rendered */}
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
  )
}
