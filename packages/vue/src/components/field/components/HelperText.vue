<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface FieldHelperTextProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useFieldContext } from '../composables/use-field-context'
import { useForwardExpose } from '~/composables'

defineProps<FieldHelperTextProps>()
const field = useFieldContext()

useForwardExpose()
</script>

<template>
  <ui.span v-bind="field.getHelperTextProps()" :as-child="asChild">
    <slot />
  </ui.span>
</template>
