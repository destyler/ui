<script lang="ts">
import type { UnwrapRef } from 'vue'
import type { PolymorphicProps } from '~/factory'
import type { UseTimerReturn } from '../composables/use-timer'

interface RootProviderProps {
  value: UnwrapRef<UseTimerReturn>
}

export interface TimerRootProviderProps extends RootProviderProps, PolymorphicProps {}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { ui } from '~/factory'
import { TimerProvider } from '../composables/use-timer-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'TimerRootProvider'
})

const props = defineProps<TimerRootProviderProps>()
const timer = computed(() => props.value)

TimerProvider(timer)
useForwardExpose()
</script>

<template>
  <ui.div v-bind="timer.getRootProps()" :as-child="asChild">
    <slot />
  </ui.div>
</template>
