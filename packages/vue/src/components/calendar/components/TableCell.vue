<script lang="ts">
import type { PolymorphicProps } from '~/factory'
import type { CalendarTableCellPropsContext } from '../composables/use-calendar-table-cell-props-context'

export interface CalendarTableCellProps extends CalendarTableCellPropsContext, PolymorphicProps {}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { ui } from '~/factory'
import { useCalendarContext } from '../composables/use-calendar-context'
import { CalendarTableCellPropsProvider } from '../composables/use-calendar-table-cell-props-context'
import { useCalendarViewPropsContext } from '../composables/use-calendar-view-props-context'
import { useForwardExpose } from '~/composables'

const props = defineProps<CalendarTableCellProps>()
const datePicker = useCalendarContext()
const viewProps = useCalendarViewPropsContext()
CalendarTableCellPropsProvider(props)

const tableCellProps = computed(() => {
  return {
    day: datePicker.value.getDayTableCellProps,
    month: datePicker.value.getMonthTableCellProps,
    year: datePicker.value.getYearTableCellProps,
    // @ts-expect-error use filter guard
  }[viewProps.view ?? 'day'](props)
})

useForwardExpose()
</script>

<template>
  <ui.td v-bind="tableCellProps" :as-child="asChild">
    <slot />
  </ui.td>
</template>
