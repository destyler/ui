<script lang="ts">
import { type PolymorphicProps } from '~/factory'

export interface HoverCardPositionerProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { computed } from 'vue'
import { useRenderStrategyProps, useForwardExpose } from '~/composables'
import { PresenceProvider, usePresence } from '~/components/presence'
import { useHoverCardContext } from '../composables/use-hover-card-context'

defineOptions({
  name: 'HoverCardPositioner',
})

defineProps<HoverCardPositionerProps>()

const hoverCard = useHoverCardContext()
const renderStrategy = useRenderStrategyProps()

const presence = usePresence(
  computed(() => ({
    ...renderStrategy.value,
    present: hoverCard.value.open,
  })),
)
PresenceProvider(presence)

useForwardExpose()
</script>

<template>
  <ui.div v-if="!presence.unmounted" v-bind="hoverCard.getPositionerProps()" :as-child="asChild">
    <slot />
  </ui.div>
</template>
