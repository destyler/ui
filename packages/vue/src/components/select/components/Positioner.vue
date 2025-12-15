<script lang="ts">

import { type PolymorphicProps } from '~/factory'

export interface SelectPositionerProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useRenderStrategyProps } from '~/composables'
import { PresenceProvider, usePresence } from '~/components/presence'
import { useSelectContext } from '../composables/use-select-context'
import { useForwardExpose } from '~/composables'
import { computed } from 'vue'

defineOptions({
  name: 'SelectPositioner'
})

defineProps<SelectPositionerProps>()

const select = useSelectContext()
const renderStrategy = useRenderStrategyProps()

const presence = usePresence(
  computed(() => ({
    ...renderStrategy.value,
    present: select.value.open,
  })),
)

PresenceProvider(presence)

useForwardExpose()
</script>

<template>
  <ui.div v-if="!presence.unmounted" v-bind="select.getPositionerProps()" :as-child="asChild">
    <slot />
  </ui.div>
</template>
