<script lang="ts">
import type { PresetTriggerProps } from '@destyler/calendar'
import type { PolymorphicProps } from '~/factory'

export interface CalendarPresetTriggerProps extends PresetTriggerProps, PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useCalendarContext } from '../composables/use-calendar-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'CalendarPresetTrigger',
})

const props = defineProps<CalendarPresetTriggerProps>()
const datePicker = useCalendarContext()

useForwardExpose()
</script>

<template>
  <ui.button v-bind="datePicker.getPresetTriggerProps(props)" :as-child="asChild">
    <slot />
  </ui.button>
</template>
