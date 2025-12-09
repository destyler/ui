<script lang="ts">
import type { AreaProps } from '@destyler/color-picker'
import type { PolymorphicProps } from '~/factory'

export interface ColorPickerAreaProps extends AreaProps, PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { ColorPickerAreaPropsProvider } from '../composables/use-color-picker-area-props-context'
import { useColorPickerContext } from '../composables/use-color-picker-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'ColorPickerArea'
})

const props = defineProps<ColorPickerAreaProps>()
const colorPicker = useColorPickerContext()

ColorPickerAreaPropsProvider(props)
useForwardExpose()
</script>

<template>
  <ui.div v-bind="colorPicker.getAreaProps(props)" :as-child="asChild">
    <slot />
  </ui.div>
</template>
