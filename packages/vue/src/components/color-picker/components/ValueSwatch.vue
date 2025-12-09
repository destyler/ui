<script lang="ts">
import type { SwatchProps } from '@destyler/color-picker'
import type { PolymorphicProps } from '~/factory'

interface ValueSwatchProps extends Omit<SwatchProps, 'value'> {}

export interface ColorPickerValueSwatchProps extends ValueSwatchProps, PolymorphicProps {}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { ui } from '~/factory'
import { useColorPickerContext } from '../composables/use-color-picker-context'
import { ColorPickerSwatchPropsProvider } from '../composables/use-color-picker-swatch-props-context'
import { useForwardExpose } from '~/composables'

const props = defineProps<ColorPickerValueSwatchProps>()
const colorPicker = useColorPickerContext()
const swatchProps = computed(() => ({
  value: colorPicker.value.value,
  respectAlpha: props.respectAlpha,
}))

ColorPickerSwatchPropsProvider(swatchProps.value)
useForwardExpose()
</script>

<template>
  <ui.div v-bind="colorPicker.getSwatchProps(swatchProps)" :as-child="asChild">
    <slot />
  </ui.div>
</template>
