<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface ColorPickerFormatSelectBaseProps extends PolymorphicProps {}
export interface ColorPickerFormatSelectProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useColorPickerContext } from '../composables/use-color-picker-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'ColorPickerFormatSelect'
})

defineProps<ColorPickerFormatSelectProps>()
const colorPicker = useColorPickerContext()

useForwardExpose()
</script>

<template>
  <ui.select v-bind="colorPicker.getFormatSelectProps()">
    <ui.option v-for="format in ['rgba', 'hsla', 'hsba']" :key="format" :value="format">
      {{ format }}
    </ui.option>
  </ui.select>
</template>
