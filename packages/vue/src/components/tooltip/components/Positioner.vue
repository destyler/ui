<script lang="ts">
import { type PolymorphicProps } from '~/factory'

export interface TooltipPositionerProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { ui } from '~/factory'
import { useRenderStrategyProps } from '~/composables'
import { PresenceProvider, usePresence } from '~/components/presence'
import { useTooltipContext } from '../composables/use-tooltip-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'TooltipPositioner'
})

defineProps<TooltipPositionerProps>()
const tooltip = useTooltipContext()
const renderStrategy = useRenderStrategyProps()

const presence = usePresence(
  computed(() => ({
    ...renderStrategy.value,
    present: tooltip.value.open,
  })),
)

PresenceProvider(presence)

useForwardExpose()
</script>

<template>
  <ui.div v-if="!presence.unmounted" v-bind="tooltip.getPositionerProps()" :as-child="asChild">
    <slot />
  </ui.div>
</template>
