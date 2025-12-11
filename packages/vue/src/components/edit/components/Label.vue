<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface EditLabelProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useEditContext } from '../composables/use-edit-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'EditLabel',
})

defineProps<EditLabelProps>()
const edit = useEditContext()

useForwardExpose()
</script>

<template>
  <ui.label v-bind="edit.getLabelProps()" :as-child="asChild">
    <slot />
  </ui.label>
</template>
