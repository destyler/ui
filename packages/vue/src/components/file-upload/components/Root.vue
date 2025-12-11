<script lang="ts">
import type { BooleanDefaults } from '~/types'
import type { PolymorphicProps } from '~/factory'
import type { RootEmits, RootProps } from '../types'

export interface FileUploadRootProps extends RootProps, PolymorphicProps {}
export interface FileUploadRootEmits extends RootEmits {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useFileUpload } from '../composables/use-file-upload'
import { FileUploadProvider } from '../composables/use-file-upload-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'FileUploadRoot',
})

const props = withDefaults(defineProps<FileUploadRootProps>(), {
  allowDrop: undefined,
  directory: undefined,
  disabled: undefined,
  invalid: undefined,
  preventDocumentDrop: undefined,
  required: undefined,
} satisfies BooleanDefaults<RootProps>)

const emits = defineEmits<FileUploadRootEmits>()

const fileUpload = useFileUpload(props, emits)
FileUploadProvider(fileUpload)

useForwardExpose()
</script>

<template>
  <ui.div v-bind="fileUpload.getRootProps()" :as-child="asChild">
    <slot />
  </ui.div>
</template>
