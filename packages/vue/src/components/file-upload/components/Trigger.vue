<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface FileUploadTriggerProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useFileUploadContext } from '../composables/use-file-upload-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'FileUploadTrigger',
})

defineProps<FileUploadTriggerProps>()
const fileUpload = useFileUploadContext()

useForwardExpose()
</script>

<template>
  <ui.button v-bind="fileUpload.getTriggerProps()" :as-child="asChild">
    <slot />
  </ui.button>
</template>
