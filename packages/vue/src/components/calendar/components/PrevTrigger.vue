<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface CalendarPrevTriggerProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useCalendarContext } from '../composables/use-calendar-context'
import { useCalendarViewPropsContext } from '../composables/use-calendar-view-props-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'CalendarPrevTrigger',
})

defineProps<CalendarPrevTriggerProps>()
const datePicker = useCalendarContext()
const viewProps = useCalendarViewPropsContext()

useForwardExpose()
</script>

<template>
  <ui.button v-bind="datePicker.getPrevTriggerProps(viewProps)" :as-child="asChild">
    <slot />
  </ui.button>
</template>
