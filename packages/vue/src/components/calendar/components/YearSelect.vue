<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface CalendarYearSelectProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useCalendarContext } from '../composables/use-calendar-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'CalendarYearSelect',
})

defineProps<CalendarYearSelectProps>()
const datePicker = useCalendarContext()

useForwardExpose()
</script>

<template>
  <ui.select v-bind="datePicker.getYearSelectProps()" :as-child="asChild">
    <option v-for="year in datePicker.getYears()" :key="year.value" :value="year.value">
      {{ year.label }}
    </option>
  </ui.select>
</template>
