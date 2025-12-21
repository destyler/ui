<script lang="ts">
import type { ActionTriggerProps } from '@destyler/timer'
import type { PolymorphicProps } from '~/factory'

export interface TimerActionTriggerProps extends ActionTriggerProps, PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useTimerContext } from '../composables/use-timer-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'TimerActionTrigger'
})

const props = defineProps<TimerActionTriggerProps>()
const timer = useTimerContext()

useForwardExpose()
</script>

<template>
  <ui.button v-bind="timer.getActionTriggerProps({ action: props.action })" :as-child="asChild">
    <slot />
  </ui.button>
</template>
