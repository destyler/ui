<script lang="ts">
import type { SlotsType, UnwrapRef } from 'vue'
import type { UseFileUploadContext } from '../composables/use-file-upload-context'

export interface FileUploadContextProps
  extends SlotsType<{
    default: UnwrapRef<UseFileUploadContext>
  }> {}
</script>

<script setup lang="ts">
import { useFileUploadContext } from '../composables/use-file-upload-context'

defineOptions({
  name: 'FileUploadContext',
})

const fileUpload = useFileUploadContext()

defineSlots<{
  default(fileUpload: UnwrapRef<UseFileUploadContext>): unknown
}>()
</script>

<template>
  <slot v-bind="fileUpload"></slot>
</template>
