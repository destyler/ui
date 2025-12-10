<script lang="ts">
import type { TableProps } from '@destyler/calendar'
import type { PolymorphicProps } from '~/factory'

export interface CalendarTableProps extends TableProps, PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useId } from 'vue'
import { useCalendarContext } from '../composables/use-calendar-context'
import { CalendarTablePropsProvider } from '../composables/use-calendar-table-props-context'
import { useCalendarViewPropsContext } from '../composables/use-calendar-view-props-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'CalendarTable',
})

const props = defineProps<CalendarTableProps>()
const datePicker = useCalendarContext()
const viewProps = useCalendarViewPropsContext()
const id = props.id ?? useId()
CalendarTablePropsProvider({ ...props, id, ...viewProps })

useForwardExpose()
</script>

<template>
  <ui.table v-bind="datePicker.getTableProps(props)" :as-child="asChild">
    <slot />
  </ui.table>
</template>
