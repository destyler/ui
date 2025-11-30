<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface CheckboxLabelProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useCheckboxContext } from '../composables/use-checkbox-context'
import { useForwardExpose } from '~/composables'

defineProps<CheckboxLabelProps>()
const checkbox = useCheckboxContext()

useForwardExpose()
</script>

<template>
  <ui.span v-bind="checkbox.getLabelProps()" :as-child="asChild">
    <slot />
  </ui.span>
</template>
