<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface TimerAreaProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useTimerContext } from '../composables/use-timer-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'TimerArea'
})

defineProps<TimerAreaProps>()
const timer = useTimerContext()

useForwardExpose()
</script>

<template>
  <ui.div v-bind="timer.getAreaProps()" :as-child="asChild">
    <slot />
  </ui.div>
</template>
