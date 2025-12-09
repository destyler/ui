<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface ColorPickerSwatchIndicatorProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useColorPickerContext } from '../composables/use-color-picker-context'
import { useColorPickerSwatchPropsContext } from '../composables/use-color-picker-swatch-props-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'ColorPickerSwatchIndicator'
})

defineProps<ColorPickerSwatchIndicatorProps>()
const colorPicker = useColorPickerContext()
const swatchProps = useColorPickerSwatchPropsContext()
useForwardExpose()
</script>

<template>
  <ui.div v-bind="colorPicker.getSwatchIndicatorProps(swatchProps)" :as-child="asChild">
    <slot />
  </ui.div>
</template>
