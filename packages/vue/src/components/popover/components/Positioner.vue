<script lang="ts">
import { type PolymorphicProps } from '~/factory'

export interface PopoverPositionerProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { ui } from '~/factory'
import { useRenderStrategyProps, useForwardExpose } from '~/composables'
import { PresenceProvider, usePresence } from '~/components/presence'
import { usePopoverContext } from '../composables/use-popover-context'

defineOptions({
  name: 'PopoverPositioner'
})

defineProps<PopoverPositionerProps>()

const popover = usePopoverContext()
const renderStrategy = useRenderStrategyProps()

const presence = usePresence(
  computed(() => ({
    ...renderStrategy.value,
    present: popover.value.open,
  })),
)
PresenceProvider(presence)

useForwardExpose()
</script>

<template>
  <ui.div v-if="!presence.unmounted" v-bind="popover.getPositionerProps()" :as-child="asChild">
    <slot />
  </ui.div>
</template>
