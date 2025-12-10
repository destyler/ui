<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface CalendarClearTriggerProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useCalendarContext } from '../composables/use-calendar-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'CalendarClearTrigger',
})

defineProps<CalendarClearTriggerProps>()
const datePicker = useCalendarContext()

useForwardExpose()
</script>

<template>
  <ui.button v-bind="datePicker.getClearTriggerProps()" :as-child="asChild">
    <slot />
  </ui.button>
</template>
