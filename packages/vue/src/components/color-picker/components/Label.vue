<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface ColorPickerLabelProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useColorPickerContext } from '../composables/use-color-picker-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'ColorPickerLabel'
})

defineProps<ColorPickerLabelProps>()
const colorPicker = useColorPickerContext()

useForwardExpose()
</script>

<template>
  <ui.label v-bind="colorPicker.getLabelProps()" :as-child="asChild">
    <slot />
  </ui.label>
</template>
