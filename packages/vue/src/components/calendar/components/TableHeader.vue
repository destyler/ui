<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface CalendarTableHeaderProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useCalendarContext } from '../composables/use-calendar-context'
import { useCalendarTablePropsContext } from '../composables/use-calendar-table-props-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'CalendarTableHeader',
})

defineProps<CalendarTableHeaderProps>()
const datePicker = useCalendarContext()
const tableProps = useCalendarTablePropsContext()

useForwardExpose()
</script>

<template>
  <ui.th v-bind="datePicker.getTableHeaderProps(tableProps)" :as-child="asChild">
    <slot />
  </ui.th>
</template>
