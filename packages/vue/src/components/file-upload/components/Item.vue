<script lang="ts">
import type { ItemProps } from '@destyler/file-upload'
import type { PolymorphicProps } from '~/factory'
import { FileUploadItemPropsProvider } from '../composables/use-file-upload-item-props-context'

export interface FileUploadItemProps extends ItemProps, PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useFileUploadContext } from '../composables/use-file-upload-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'FileUploadItem',
})

const props = defineProps<FileUploadItemProps>()

const fileUpload = useFileUploadContext()
FileUploadItemPropsProvider(props)

useForwardExpose()
</script>

<template>
  <ui.li v-bind="fileUpload.getItemProps(props)" :as-child="asChild">
    <slot />
  </ui.li>
</template>
