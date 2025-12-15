<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface SelectControlProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useSelectContext } from '../composables/use-select-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'SelectControl'
})

defineProps<SelectControlProps>()
const select = useSelectContext()

useForwardExpose()
</script>

<template>
  <ui.div v-bind="select.getControlProps()" :as-child="asChild">
    <slot />
  </ui.div>
</template>
