<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface FileUploadLabelProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useFileUploadContext } from '../composables/use-file-upload-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'FileUploadLabel',
})

defineProps<FileUploadLabelProps>()
const fileUpload = useFileUploadContext()

useForwardExpose()
</script>

<template>
  <ui.label v-bind="fileUpload.getLabelProps()" :as-child="asChild">
    <slot />
  </ui.label>
</template>
