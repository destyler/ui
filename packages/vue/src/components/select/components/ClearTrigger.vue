<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface SelectClearTriggerProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useSelectContext } from '../composables/use-select-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'SelectClearTrigger'
})

defineProps<SelectClearTriggerProps>()
const select = useSelectContext()

useForwardExpose()
</script>

<template>
  <ui.button v-bind="select.getClearTriggerProps()" :as-child="asChild">
    <slot />
  </ui.button>
</template>
