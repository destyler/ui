<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface CalendarMonthSelectProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useCalendarContext } from '../composables/use-calendar-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'CalendarMonthSelect',
})

defineProps<CalendarMonthSelectProps>()
const datePicker = useCalendarContext()

useForwardExpose()
</script>

<template>
  <ui.select v-bind="datePicker.getMonthSelectProps()" :as-child="asChild">
    <option v-for="month in datePicker.getMonths()" :key="month.value" :value="month.value">
      {{ month.label }}
    </option>
  </ui.select>
</template>
