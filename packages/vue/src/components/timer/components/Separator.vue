<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface TimerSeparatorProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useTimerContext } from '../composables/use-timer-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'TimerSeparator'
})

defineProps<TimerSeparatorProps>()
const timer = useTimerContext()

useForwardExpose()
</script>

<template>
  <ui.div v-bind="timer.getSeparatorProps()" :as-child="asChild">
    <slot />
  </ui.div>
</template>
