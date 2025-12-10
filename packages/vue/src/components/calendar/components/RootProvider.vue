<script lang="ts">
import type { UnwrapRef } from 'vue'
import type { RenderStrategyProps } from '~/composables'
import type { PolymorphicProps } from '~/factory'
import type { UseCalendarReturn } from '../composables/use-calendar'

interface RootProviderProps {
  value: UnwrapRef<UseCalendarReturn>
}

export interface CalendarRootProviderProps extends RootProviderProps, RenderStrategyProps, PolymorphicProps {}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { RenderStrategyPropsProvider } from '~/composables'
import { ui } from '~/factory'
import { CalendarProvider } from '../composables/use-calendar-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'CalendarRootProvider',
})

const props = defineProps<CalendarRootProviderProps>()
const datePicker = computed(() => props.value)

CalendarProvider(datePicker)
RenderStrategyPropsProvider(computed(() => ({ lazyMount: props.lazyMount, unmountOnExit: props.unmountOnExit })))

useForwardExpose()
</script>

<template>
  <ui.div v-bind="datePicker.getRootProps()" :as-child="asChild">
    <slot />
  </ui.div>
</template>
