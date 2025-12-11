<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface EditControlProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useEditContext } from '../composables/use-edit-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'EditControl',
})

defineProps<EditControlProps>()
const edit = useEditContext()

useForwardExpose()
</script>

<template>
  <ui.div v-bind="edit.getControlProps()" :as-child="asChild">
    <slot />
  </ui.div>
</template>
