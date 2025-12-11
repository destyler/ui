<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface EditCancelTriggerProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useEditContext } from '../composables/use-edit-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'EditCancelTrigger',
})

defineProps<EditCancelTriggerProps>()
const edit = useEditContext()

useForwardExpose()
</script>

<template>
  <ui.button v-bind="edit.getCancelTriggerProps()" :as-child="asChild">
    <slot />
  </ui.button>
</template>
