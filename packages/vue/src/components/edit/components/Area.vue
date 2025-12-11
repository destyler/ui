<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface EditAreaProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useEditContext } from '../composables/use-edit-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'EditArea',
})

defineProps<EditAreaProps>()
const edit = useEditContext()

useForwardExpose()
</script>

<template>
  <ui.div v-bind="edit.getAreaProps()" :as-child="asChild">
    <slot />
  </ui.div>
</template>
