<script lang="ts">
import type { SwatchTriggerProps } from '@destyler/color-picker'
import type { PolymorphicProps } from '~/factory'

export interface ColorPickerSwatchTriggerProps extends SwatchTriggerProps, PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useColorPickerContext } from '../composables/use-color-picker-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'ColorPickerSwatchTrigger'
})

const props = defineProps<ColorPickerSwatchTriggerProps>()
const colorPicker = useColorPickerContext()
useForwardExpose()
</script>

<template>
  <ui.button v-bind="colorPicker.getSwatchTriggerProps(props)" :as-child="asChild">
    <slot />
  </ui.button>
</template>
