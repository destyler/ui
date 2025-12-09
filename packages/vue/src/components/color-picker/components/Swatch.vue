<script lang="ts">
import type { SwatchProps } from '@destyler/color-picker'
import type { PolymorphicProps } from '~/factory'

export interface ColorPickerSwatchProps extends SwatchProps, PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useColorPickerContext } from '../composables/use-color-picker-context'
import { ColorPickerSwatchPropsProvider } from '../composables/use-color-picker-swatch-props-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'ColorPickerSwatch'
})

const props = defineProps<ColorPickerSwatchProps>()
const colorPicker = useColorPickerContext()

ColorPickerSwatchPropsProvider(props)
useForwardExpose()
</script>

<template>
  <ui.div v-bind="colorPicker.getSwatchProps(props)" :as-child="asChild">
    <slot />
  </ui.div>
</template>
