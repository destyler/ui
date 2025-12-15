<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface SelectLabelProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useSelectContext } from '../composables/use-select-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'SelectLabel'
})

defineProps<SelectLabelProps>()
const select = useSelectContext()

useForwardExpose()
</script>

<template>
  <ui.label v-bind="select.getLabelProps()" :as-child="asChild">
    <slot />
  </ui.label>
</template>
