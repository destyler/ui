<script lang="ts">
import type { TransparencyGridProps } from '@destyler/color-picker'
import type { PolymorphicProps } from '~/factory'

export interface ColorPickerTransparencyGridProps extends TransparencyGridProps, PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useColorPickerContext } from '../composables/use-color-picker-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'ColorPickerTransparencyGrid'
})

const props = defineProps<ColorPickerTransparencyGridProps>()
const colorPicker = useColorPickerContext()

useForwardExpose()
</script>

<template>
  <ui.div v-bind="colorPicker.getTransparencyGridProps(props)" :as-child="asChild">
    <slot />
  </ui.div>
</template>
