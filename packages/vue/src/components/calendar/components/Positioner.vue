<script lang="ts">
import { type PolymorphicProps } from '~/factory'

export interface CalendarPositionerProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { computed } from 'vue'
import { useRenderStrategyProps } from '~/composables'
import { PresenceProvider, usePresence } from '~/components/presence'
import { useCalendarContext } from '../composables/use-calendar-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'CalendarPositioner',
})

defineProps<CalendarPositionerProps>()
const datePicker = useCalendarContext()
const renderStrategy = useRenderStrategyProps()

const presence = usePresence(
  computed(() => ({
    ...renderStrategy.value,
    present: datePicker.value.open,
  })),
)
PresenceProvider(presence)

useForwardExpose()
</script>

<template>
  <ui.div v-if="!presence.unmounted" v-bind="datePicker.getPositionerProps()" :as-child="asChild">
    <slot />
  </ui.div>
</template>
