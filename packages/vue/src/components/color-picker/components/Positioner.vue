<script lang="ts">
import { computed } from 'vue'
import { type PolymorphicProps } from '~/factory'

export interface ColorPickerPositionerProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useRenderStrategyProps, useForwardExpose } from '~/composables'
import { PresenceProvider, usePresence } from '~/components/presence'
import { useColorPickerContext } from '../composables/use-color-picker-context'

defineOptions({
  name: 'ColorPickerPositioner'
})

defineProps<ColorPickerPositionerProps>()
const colorPicker = useColorPickerContext()
const renderStrategy = useRenderStrategyProps()

const presence = usePresence(
  computed(() => ({
    ...renderStrategy.value,
    present: colorPicker.value.open,
  })),
)

PresenceProvider(presence)

useForwardExpose()
</script>

<template>
  <ui.div v-if="!presence.unmounted" v-bind="colorPicker.getPositionerProps()" :as-child="asChild">
    <slot />
  </ui.div>
</template>
