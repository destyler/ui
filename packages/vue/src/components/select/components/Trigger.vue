<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface SelectTriggerProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useSelectContext } from '../composables/use-select-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'SelectTrigger'
})

defineProps<SelectTriggerProps>()
const select = useSelectContext()

useForwardExpose()
</script>

<template>
  <ui.button v-bind="select.getTriggerProps()" :as-child="asChild">
    <slot />
  </ui.button>
</template>
