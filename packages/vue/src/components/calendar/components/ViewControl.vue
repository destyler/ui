<script lang="ts">
import type { PolymorphicProps } from '~/factory'
import { useCalendarViewPropsContext } from '../composables/use-calendar-view-props-context'

export interface CalendarViewControlProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useCalendarContext } from '../composables/use-calendar-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'CalendarViewControl',
})

defineProps<CalendarViewControlProps>()
const datePicker = useCalendarContext()
const viewProps = useCalendarViewPropsContext()

useForwardExpose()
</script>

<template>
  <ui.div v-bind="datePicker.getViewControlProps(viewProps)" :as-child="asChild">
    <slot />
  </ui.div>
</template>
