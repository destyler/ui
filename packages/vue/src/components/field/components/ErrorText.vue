<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface FieldErrorTextProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useFieldContext } from '../composables/use-field-context'
import { useForwardExpose } from '~/composables'

defineProps<FieldErrorTextProps>()
const field = useFieldContext()

useForwardExpose()
</script>

<template>
  <ui.span v-if="field.invalid" v-bind="field.getErrorTextProps()" :as-child="asChild">
    <slot />
  </ui.span>
</template>
