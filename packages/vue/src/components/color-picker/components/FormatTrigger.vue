<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface ColorPickerFormatTriggerProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useColorPickerContext } from '../composables/use-color-picker-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'ColorPickerFormatTrigger'
})

defineProps<ColorPickerFormatTriggerProps>()
const colorPicker = useColorPickerContext()

useForwardExpose()
</script>

<template>
  <ui.button v-bind="colorPicker.getFormatTriggerProps()" :as-child="asChild">
    <slot />
  </ui.button>
</template>
