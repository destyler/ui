<script lang="ts">
import type { ColorFormat } from '@destyler/color-picker'
import type { PolymorphicProps } from '~/factory'

export interface ColorPickerViewProps extends PolymorphicProps {
  format: ColorFormat
}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { colorPickerAnatomy } from '../anatomy'
import { useColorPickerContext } from '../composables/use-color-picker-context'
import { ColorPickerFormatPropsProvider } from '../composables/use-color-picker-format-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'ColorPickerView'
})

const props = defineProps<ColorPickerViewProps>()
const colorPicker = useColorPickerContext()

ColorPickerFormatPropsProvider(props)

useForwardExpose()
</script>

<template>
  <ui.div
    v-if="colorPicker.format === format"
    v-bind="colorPickerAnatomy.build().view.attrs"
    :data-format="format"
    :as-child="asChild"
  >
    <slot />
  </ui.div>
</template>
