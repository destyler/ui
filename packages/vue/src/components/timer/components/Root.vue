<script lang="ts">
import type { BooleanDefaults } from '~/types'
import type { PolymorphicProps } from '~/factory'
import type { RootEmits, RootProps } from '../types'

export interface TimerRootProps extends RootProps, PolymorphicProps {}
export interface TimerRootEmits extends RootEmits {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useTimer } from '../composables/use-timer'
import { TimerProvider } from '../composables/use-timer-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'TimerRoot'
})

const props = withDefaults(defineProps<TimerRootProps>(), {
  autoStart: undefined,
  countdown: undefined,
} satisfies BooleanDefaults<RootProps>)

const emits = defineEmits<TimerRootEmits>()

const timer = useTimer(props, emits)
TimerProvider(timer)

useForwardExpose()
</script>

<template>
  <ui.div v-bind="timer.getRootProps()" :as-child="asChild">
    <slot />
  </ui.div>
</template>
