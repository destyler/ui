<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface CalendarTableHeadProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useCalendarContext } from '../composables/use-calendar-context'
import { useCalendarTablePropsContext } from '../composables/use-calendar-table-props-context'
import { useForwardExpose } from '~/composables'

defineProps<CalendarTableHeadProps>()
const datePicker = useCalendarContext()
const tableProps = useCalendarTablePropsContext()

useForwardExpose()
</script>

<template>
  <ui.thead v-bind="datePicker.getTableHeadProps(tableProps)" :as-child="asChild">
    <slot />
  </ui.thead>
</template>
