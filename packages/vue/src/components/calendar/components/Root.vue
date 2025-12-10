<script lang="ts">
import type { BooleanDefaults } from '~/types'
import type { RenderStrategyProps } from '~/composables'
import type { PolymorphicProps } from '~/factory'
import type { RootEmits, RootProps } from '../types'

export interface CalendarRootProps extends RootProps, RenderStrategyProps, PolymorphicProps {}
export interface CalendarRootEmits extends RootEmits {}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { RenderStrategyPropsProvider, useForwardExpose } from '~/composables'
import { ui } from '~/factory'
import { useCalendar } from '../composables/use-calendar'
import { CalendarProvider } from '../composables/use-calendar-context'

defineOptions({
  name: 'CalendarRoot',
})

const props = withDefaults(defineProps<CalendarRootProps>(), {
  closeOnSelect: undefined,
  defaultOpen: undefined,
  disabled: undefined,
  fixedWeeks: undefined,
  open: undefined,
  readOnly: undefined,
} satisfies BooleanDefaults<RootProps>)

const emits = defineEmits<CalendarRootEmits>()

const datePicker = useCalendar(props, emits)
CalendarProvider(datePicker)
RenderStrategyPropsProvider(computed(() => ({ lazyMount: props.lazyMount, unmountOnExit: props.unmountOnExit })))

useForwardExpose()
</script>

<template>
  <ui.div v-bind="datePicker.getRootProps()" :as-child="asChild">
    <slot />
  </ui.div>
</template>
