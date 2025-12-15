<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface SelectListProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useSelectContext } from '../composables/use-select-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'SelectList'
})

defineProps<SelectListProps>()
const select = useSelectContext()

useForwardExpose()
</script>

<template>
  <ui.div v-bind="select.getListProps()" :as-child="asChild">
    <slot />
  </ui.div>
</template>
