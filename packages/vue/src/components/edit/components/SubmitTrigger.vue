<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface EditSubmitTriggerProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useEditContext } from '../composables/use-edit-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'EditSubmitTrigger',
})

defineProps<EditSubmitTriggerProps>()
const edit = useEditContext()

useForwardExpose()
</script>

<template>
  <ui.button v-bind="edit.getSubmitTriggerProps()" :as-child="asChild">
    <slot />
  </ui.button>
</template>
