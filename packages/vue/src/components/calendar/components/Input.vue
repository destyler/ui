<script lang="ts">
import type { InputProps } from '@destyler/calendar'
import type { PolymorphicProps } from '~/factory'

export interface CalendarInputProps extends InputProps, PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useCalendarContext } from '../composables/use-calendar-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'CalendarInput',
})

const props = defineProps<CalendarInputProps>()
const datePicker = useCalendarContext()

useForwardExpose()
</script>

<template>
  <ui.input v-bind="datePicker.getInputProps(props)" :as-child="asChild">
    <slot />
  </ui.input>
</template>
