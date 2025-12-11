<script lang="ts">
import type { UnwrapRef } from 'vue'
import type { PolymorphicProps } from '~/factory'
import type { UseFileUploadReturn } from '../composables/use-file-upload'

interface RootProviderProps {
  value: UnwrapRef<UseFileUploadReturn>
}

export interface FileUploadRootProviderProps extends RootProviderProps, PolymorphicProps {}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { ui } from '~/factory'
import { FileUploadProvider } from '../composables/use-file-upload-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'FileUploadRootProvider',
})

const props = defineProps<FileUploadRootProviderProps>()
const fileUpload = computed(() => props.value)

FileUploadProvider(fileUpload)

useForwardExpose()
</script>

<template>
  <ui.div v-bind="fileUpload.getRootProps()" :as-child="asChild">
    <slot />
  </ui.div>
</template>
