<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface CalendarContentProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { mergeProps } from '@destyler/vue'
import { computed } from 'vue'
import { ui } from '~/factory'
import { useCalendarContext } from '../composables/use-calendar-context'
import { useForwardExpose } from '~/composables'
import { usePresenceContext } from '~/components/presence'

defineOptions({
  name: 'CalendarContent',
})

defineProps<CalendarContentProps>()
const datePicker = useCalendarContext()
const presence = usePresenceContext()
const mergedProps = computed(() => mergeProps(datePicker.value.getContentProps(), presence.value.presenceProps))

useForwardExpose()
</script>

<template>
  <ui.div v-if="!presence.unmounted" v-bind="mergedProps" :as-child="asChild">
    <slot />
  </ui.div>
</template>
