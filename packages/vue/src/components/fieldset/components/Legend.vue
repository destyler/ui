<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface FieldsetLegendProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useFieldsetContext } from '../composables/use-fieldset-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'FieldsetLegend',
})

defineProps<FieldsetLegendProps>()
const fieldset = useFieldsetContext()

useForwardExpose()
</script>

<template>
  <ui.legend v-bind="fieldset.getLegendProps()" :as-child="asChild"><slot /></ui.legend>
</template>
