<script setup lang="ts">
import { ref } from 'vue'
import { FileUpload } from '../index'

const testProps = ref<string[]>([])

// Create a mock image file for testing purposes (synchronously)
function createMockImageFile(): File {
  // Create a small 1x1 transparent PNG as a base64 data URL
  const base64Data = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
  const byteCharacters = atob(base64Data)
  const byteNumbers = new Array(byteCharacters.length)
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i)
  }
  const byteArray = new Uint8Array(byteNumbers)
  const blob = new Blob([byteArray], { type: 'image/png' })
  return new File([blob], 'test-image.png', { type: 'image/png' })
}

const mockImageFile = createMockImageFile()
</script>

<template>
  <FileUpload.Root v-model="testProps">
    <FileUpload.Dropzone>
      <FileUpload.Label>Drag your file(s) here</FileUpload.Label>
    </FileUpload.Dropzone>
    <FileUpload.Trigger>Choose file(s)</FileUpload.Trigger>
    <FileUpload.ClearTrigger>Clear</FileUpload.ClearTrigger>
    <FileUpload.ItemGroup>
      <FileUpload.Context v-slot="api">
        <FileUpload.Item v-for="file in api.acceptedFiles" :key="file.name as string" :file="file">
          <FileUpload.ItemPreview>
            <FileUpload.ItemPreviewImage />
          </FileUpload.ItemPreview>
          <FileUpload.ItemName>{{ file.name }}</FileUpload.ItemName>
          <FileUpload.ItemSizeText>{{ api.getFileSize(file) }}</FileUpload.ItemSizeText>
          <FileUpload.ItemDeleteTrigger>Remove</FileUpload.ItemDeleteTrigger>
        </FileUpload.Item>
      </FileUpload.Context>
      <!-- Static mock item for testing to ensure all parts are rendered -->
      <FileUpload.Item :file="mockImageFile">
        <FileUpload.ItemPreview>
          <FileUpload.ItemPreviewImage />
        </FileUpload.ItemPreview>
        <FileUpload.ItemName>{{ mockImageFile.name }}</FileUpload.ItemName>
        <FileUpload.ItemSizeText>1 KB</FileUpload.ItemSizeText>
        <FileUpload.ItemDeleteTrigger>Remove</FileUpload.ItemDeleteTrigger>
      </FileUpload.Item>
    </FileUpload.ItemGroup>
    <FileUpload.HiddenInput />
  </FileUpload.Root>
</template>
