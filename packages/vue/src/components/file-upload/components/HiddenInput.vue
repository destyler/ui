<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface FileUploadHiddenInputProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useFileUploadContext } from '../composables/use-file-upload-context'
import { useFieldContext } from '~/components/field'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'FileUploadHiddenInput',
})

defineProps<FileUploadHiddenInputProps>()
const fileUpload = useFileUploadContext()
const field = useFieldContext()

useForwardExpose()
</script>

<template>
  <ui.input :aria-describedby="field?.ariaDescribedby" v-bind="fileUpload.getHiddenInputProps()" :as-child="asChild">
    <slot />
  </ui.input>
</template>
