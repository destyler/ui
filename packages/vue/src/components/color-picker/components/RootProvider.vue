<script lang="ts">
import type { UnwrapRef } from 'vue'
import type { RenderStrategyProps } from '~/composables'
import type { PolymorphicProps } from '~/factory'
import type { UseColorPickerReturn } from '../composables/use-color-picker'

interface RootProviderProps {
  value: UnwrapRef<UseColorPickerReturn>
}

export interface ColorPickerRootProviderProps extends RootProviderProps, RenderStrategyProps, PolymorphicProps {}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { RenderStrategyPropsProvider, useForwardExpose } from '~/composables'
import { ui } from '~/factory'
import { ColorPickerProvider } from '../composables/use-color-picker-context'

defineOptions({
  name: 'ColorPickerRootProvider'
})

const props = defineProps<ColorPickerRootProviderProps>()
const colorPicker = computed(() => props.value)

ColorPickerProvider(colorPicker)
RenderStrategyPropsProvider(computed(() => ({ lazyMount: props.lazyMount, unmountOnExit: props.unmountOnExit })))

useForwardExpose()
</script>

<template>
  <ui.div v-bind="colorPicker.getRootProps()" :as-child="asChild">
    <slot />
  </ui.div>
</template>
