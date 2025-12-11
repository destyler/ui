<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface FileUploadItemSizeTextProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useFileUploadContext } from '../composables/use-file-upload-context'
import { useFileUploadItemPropsContext } from '../composables/use-file-upload-item-props-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'FileUploadItemSizeText',
})

defineProps<FileUploadItemSizeTextProps>()

const fileUpload = useFileUploadContext()
const itemProps = useFileUploadItemPropsContext()
const slots = defineSlots()

useForwardExpose()
</script>

<template>
  <ui.div v-bind="fileUpload.getItemSizeTextProps(itemProps)" :as-child="asChild">
    <slot>
      {{ slots.default?.() || fileUpload.getFileSize(itemProps.file) }}
    </slot>
  </ui.div>
</template>
