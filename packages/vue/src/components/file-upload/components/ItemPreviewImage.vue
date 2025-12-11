<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface FileUploadItemPreviewImageProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { ui } from '~/factory'
import { useFileUploadContext } from '../composables/use-file-upload-context'
import { useFileUploadItemPropsContext } from '../composables/use-file-upload-item-props-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'FileUploadItemPreviewImage',
})

defineProps<FileUploadItemPreviewImageProps>()

const fileUpload = useFileUploadContext()
const itemProps = useFileUploadItemPropsContext()

const url = ref<string>('')

watchEffect((onCleanup) => {
  const cleanup = fileUpload.value.createFileUrl(itemProps.file, (src) => (url.value = src))
  onCleanup(cleanup)
})

useForwardExpose()
</script>

<template>
  <ui.img v-if="url" v-bind="fileUpload.getItemPreviewImageProps({ ...itemProps, url })" />
</template>
