<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface CalendarLabelProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useCalendarContext } from '../composables/use-calendar-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'CalendarLabel',
})

defineProps<CalendarLabelProps>()
const datePicker = useCalendarContext()

useForwardExpose()
</script>

<template>
  <ui.label v-bind="datePicker.getLabelProps()" :as-child="asChild">
    <slot />
  </ui.label>
</template>
