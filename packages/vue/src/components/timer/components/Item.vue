<script lang="ts">
import type { ItemProps } from '@destyler/timer'
import type { PolymorphicProps } from '~/factory'

export interface TimerItemProps extends ItemProps, PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useTimerContext } from '../composables/use-timer-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'TimerItem'
})

const props = defineProps<TimerItemProps>()
const timer = useTimerContext()

useForwardExpose()
</script>

<template>
  <ui.div v-bind="timer.getItemProps({ type: props.type })" :as-child="asChild">
    <slot>{{ timer.formattedTime[props.type] }}</slot>
  </ui.div>
</template>
