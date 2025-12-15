<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface SelectIndicatorProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useSelectContext } from '../composables/use-select-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'SelectIndicator'
})

defineProps<SelectIndicatorProps>()
const select = useSelectContext()

useForwardExpose()
</script>

<template>
  <ui.div v-bind="select.getIndicatorProps()" :as-child="asChild">
    <slot />
  </ui.div>
</template>
