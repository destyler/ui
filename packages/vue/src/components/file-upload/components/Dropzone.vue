<script lang="ts">
import type { DropzoneProps } from '@destyler/file-upload'
import type { BooleanDefaults } from '~/types'
import type { PolymorphicProps } from '~/factory'

export interface FileUploadDropzoneProps extends PolymorphicProps, DropzoneProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useFileUploadContext } from '../composables/use-file-upload-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'FileUploadDropzone',
})

const props = withDefaults(defineProps<FileUploadDropzoneProps>(), {
  disableClick: undefined,
} satisfies BooleanDefaults<DropzoneProps>)

const fileUpload = useFileUploadContext()

useForwardExpose()
</script>

<template>
  <ui.div v-bind="fileUpload.getDropzoneProps(props)" :as-child="asChild">
    <slot />
  </ui.div>
</template>
