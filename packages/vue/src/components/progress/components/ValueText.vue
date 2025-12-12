<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface ProgressValueTextProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useProgressContext } from '../composables/use-progress-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'ProgressValueText',
})

defineProps<ProgressValueTextProps>()
const progress = useProgressContext()
const slots = defineSlots()

useForwardExpose()
</script>

<template>
  <ui.span v-bind="progress.getValueTextProps()" :as-child="asChild">
    <slot>{{ slots.default?.() || progress.percentAsString }}</slot>
  </ui.span>
</template>
