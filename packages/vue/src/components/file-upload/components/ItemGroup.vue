<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface FileUploadItemGroupProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useFileUploadContext } from '../composables/use-file-upload-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'FileUploadItemGroup',
})

defineProps<FileUploadItemGroupProps>()
const fileUpload = useFileUploadContext()

useForwardExpose()
</script>

<template>
  <ui.ul v-bind="fileUpload.getItemGroupProps()" :as-child="asChild">
    <slot />
  </ui.ul>
</template>
