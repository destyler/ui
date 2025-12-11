<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface FileUploadItemNameProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useFileUploadContext } from '../composables/use-file-upload-context'
import { useFileUploadItemPropsContext } from '../composables/use-file-upload-item-props-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'FileUploadItemName',
})

defineProps<FileUploadItemNameProps>()
const fileUpload = useFileUploadContext()
const itemProps = useFileUploadItemPropsContext()
const slots = defineSlots()

useForwardExpose()
</script>

<template>
  <ui.div v-bind="fileUpload.getItemNameProps(itemProps)" :as-child="asChild">
    <slot>
      {{ slots.default?.() || itemProps.file.name }}
    </slot>
  </ui.div>
</template>
