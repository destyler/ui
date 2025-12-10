<script lang="ts">
import type { DateView } from '@destyler/calendar'
import type { PolymorphicProps } from '~/factory'

export interface CalendarViewProps
  extends PolymorphicProps {
  view: DateView
}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useCalendarContext } from '../composables/use-calendar-context'
import { CalendarViewPropsProvider } from '../composables/use-calendar-view-props-context'
import { calendarAnatomy } from '../anatomy'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'CalendarView',
})

const props = defineProps<CalendarViewProps>()
const datePicker = useCalendarContext()

CalendarViewPropsProvider(props)
useForwardExpose()
</script>

<template>
  <ui.div v-bind="calendarAnatomy.build().view.attrs" :hidden="datePicker.view !== view" :as-child="asChild">
    <slot />
  </ui.div>
</template>
