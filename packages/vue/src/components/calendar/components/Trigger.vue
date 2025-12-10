<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface CalendarTriggerProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useCalendarContext } from '../composables/use-calendar-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'CalendarTrigger',
})

defineProps<CalendarTriggerProps>()
const datePicker = useCalendarContext()

useForwardExpose()
</script>

<template>
  <ui.button v-bind="datePicker.getTriggerProps()" :as-child="asChild">
    <slot />
  </ui.button>
</template>
