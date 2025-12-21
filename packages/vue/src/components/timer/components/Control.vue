<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface TimerControlProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useTimerContext } from '../composables/use-timer-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'TimerControl'
})

defineProps<TimerControlProps>()
const timer = useTimerContext()

useForwardExpose()
</script>

<template>
  <ui.div v-bind="timer.getControlProps()" :as-child="asChild">
    <slot />
  </ui.div>
</template>
