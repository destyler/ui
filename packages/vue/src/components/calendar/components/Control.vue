<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface CalendarControlProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useCalendarContext } from '../composables/use-calendar-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'CalendarControl',
})

defineProps<CalendarControlProps>()
const datePicker = useCalendarContext()

useForwardExpose()
</script>

<template>
  <ui.div v-bind="datePicker.getControlProps()" :as-child="asChild">
    <slot />
  </ui.div>
</template>
