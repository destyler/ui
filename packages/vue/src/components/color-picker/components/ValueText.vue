<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface ColorPickerValueTextProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useColorPickerContext } from '../composables/use-color-picker-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'ColorPickerValueText'
})

defineProps<ColorPickerValueTextProps>()
const colorPicker = useColorPickerContext()
const slots = defineSlots()

useForwardExpose()
</script>

<template>
  <ui.span v-bind="colorPicker.getValueTextProps()" :as-child="asChild">
    <slot>
      {{ slots.default?.() || colorPicker.valueAsString }}
    </slot>
  </ui.span>
</template>
