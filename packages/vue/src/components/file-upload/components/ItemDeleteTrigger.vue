<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface FileUploadItemDeleteTriggerProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useFileUploadContext } from '../composables/use-file-upload-context'
import { useFileUploadItemPropsContext } from '../composables/use-file-upload-item-props-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'FileUploadItemDeleteTrigger',
})

defineProps<FileUploadItemDeleteTriggerProps>()
const fileUpload = useFileUploadContext()
const itemProps = useFileUploadItemPropsContext()

useForwardExpose()
</script>

<template>
  <ui.button v-bind="fileUpload.getItemDeleteTriggerProps(itemProps)" :as-child="asChild">
    <slot />
  </ui.button>
</template>
