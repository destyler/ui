<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface FieldLabelProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useFieldContext } from '../composables/use-field-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'FieldLabel'
})

defineProps<FieldLabelProps>()
const field = useFieldContext()

useForwardExpose()
</script>

<template>
  <ui.label v-bind="field.getLabelProps()" :as-child="asChild"><slot /></ui.label>
</template>
