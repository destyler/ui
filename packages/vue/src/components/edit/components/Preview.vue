<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface EditPreviewProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useEditContext } from '../composables/use-edit-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'EditPreview',
})

defineProps<EditPreviewProps>()
const edit = useEditContext()

useForwardExpose()
</script>

<template>
  <ui.span v-bind="edit.getPreviewProps()" :as-child="asChild">
    <slot />
  </ui.span>
</template>
