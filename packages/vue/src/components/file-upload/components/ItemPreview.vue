<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface FileUploadItemPreviewProps extends PolymorphicProps  {
  /**
   * The file type to match against. Matches all file types by default.
   * @default '.*'
   */
  type?: string
}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useFileUploadContext } from '../composables/use-file-upload-context'
import { useFileUploadItemPropsContext } from '../composables/use-file-upload-item-props-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'FileUploadItemPreview',
})

withDefaults(defineProps<FileUploadItemPreviewProps>(), {
  type: '.*',
})

const fileUpload = useFileUploadContext()
const itemProps = useFileUploadItemPropsContext()

useForwardExpose()
</script>

<template>
  <ui.div
    v-if="itemProps.file.type.match(type ?? '.*')"
    v-bind="fileUpload.getItemPreviewProps(itemProps)"
    :as-child="asChild"
  >
    <slot />
  </ui.div>
</template>
