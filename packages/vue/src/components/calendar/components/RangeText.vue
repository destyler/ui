<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface CalendarRangeTextProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useCalendarContext } from '../composables/use-calendar-context'
import { useForwardExpose } from '~/composables'

defineProps<CalendarRangeTextProps>()
const datePicker = useCalendarContext()

useForwardExpose()
</script>

<template>
  <ui.div v-bind="datePicker.getRangeTextProps()" :as-child="asChild">
    {{ datePicker.visibleRangeText.start }}
  </ui.div>
</template>
