<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface CalendarTableCellTriggerProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { ui } from '~/factory'
import { useCalendarContext } from '../composables/use-calendar-context'
import { useCalendarTableCellPropsContext } from '../composables/use-calendar-table-cell-props-context'
import { useCalendarViewPropsContext } from '../composables/use-calendar-view-props-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'CalendarTableCellTrigger',
})

defineProps<CalendarTableCellTriggerProps>()
const datePicker = useCalendarContext()
const cellProps = useCalendarTableCellPropsContext()
const viewProps = useCalendarViewPropsContext()

const triggerProps = computed(() => {
  const viewMap = {
    day: datePicker.value.getDayTableCellTriggerProps,
    month: datePicker.value.getMonthTableCellTriggerProps,
    year: datePicker.value.getYearTableCellTriggerProps,
  }

  const viewFn = viewMap[viewProps.view]

  // @ts-expect-error fix later
  return viewFn(cellProps)
})

useForwardExpose()
</script>

<template>
  <ui.div v-bind="triggerProps" :as-child="asChild">
    <slot />
  </ui.div>
</template>
