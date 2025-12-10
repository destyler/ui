<script lang="ts">
import { type PolymorphicProps } from '~/factory'

export interface ComboboxPositionerProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
  import { computed } from 'vue'
import { useRenderStrategyProps, useForwardExpose } from '~/composables'
import { PresenceProvider, usePresence } from '~/components/presence'
import { useComboboxContext } from '../composables/use-combobox-context'
import { ui } from '~/factory'

defineOptions({
  name: 'ComboboxPositioner',
})

defineProps<ComboboxPositionerProps>()
const combobox = useComboboxContext()
const renderStrategy = useRenderStrategyProps()

const presence = usePresence(
  computed(() => ({
    ...renderStrategy.value,
    present: combobox.value.open,
  })),
)
PresenceProvider(presence)

useForwardExpose()
</script>

<template>
  <ui.div v-if="!presence.unmounted" v-bind="combobox.getPositionerProps()" :as-child="asChild">
    <slot />
  </ui.div>
</template>
