<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface FieldRequiredIndicatorProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useFieldContext } from '../composables/use-field-context'
import { useForwardExpose } from '~/composables'

defineProps<FieldRequiredIndicatorProps>()

const field = useFieldContext()

useForwardExpose()
</script>

<template>
  <ui.span v-if="field.required" v-bind="field.getRequiredIndicatorProps()" :as-child="asChild">
    <slot>*</slot>
  </ui.span>
  <slot v-else name="fallback"></slot>
</template>
