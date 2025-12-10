<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface CalendarTableBodyProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useCalendarContext } from '../composables/use-calendar-context'
import { useCalendarTablePropsContext } from '../composables/use-calendar-table-props-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'CalendarTableBody',
})

defineProps<CalendarTableBodyProps>()
const datePicker = useCalendarContext()
const tableProps = useCalendarTablePropsContext()

useForwardExpose()
</script>

<template>
  <ui.tbody v-bind="datePicker.getTableBodyProps(tableProps)" :as-child="asChild">
    <slot />
  </ui.tbody>
</template>
