<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface CalendarTableRowProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useCalendarContext } from '../composables/use-calendar-context'
import { useCalendarTablePropsContext } from '../composables/use-calendar-table-props-context'
import { useForwardExpose } from '~/composables'

defineProps<CalendarTableRowProps>()
const datePicker = useCalendarContext()
const tableProps = useCalendarTablePropsContext()

useForwardExpose()
</script>

<template>
  <ui.tr v-bind="datePicker.getTableRowProps(tableProps)" :as-child="asChild">
    <slot />
  </ui.tr>
</template>
