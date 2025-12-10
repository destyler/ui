<script lang="ts">
import type { SlotsType, UnwrapRef } from 'vue'
import type { UseCalendarContext } from '../composables/use-calendar-context'

export interface CalendarContextProps
  extends SlotsType<{
    default: UnwrapRef<UseCalendarContext>
  }> {}
</script>

<script setup lang="ts">
import { useCalendarContext } from '../composables/use-calendar-context'

defineOptions({
  name: 'CalendarContext',
})

const datePicker = useCalendarContext()

defineSlots<{
  default(datePicker: UnwrapRef<UseCalendarContext>): unknown
}>()
</script>

<template>
  <slot v-bind="datePicker"></slot>
</template>
