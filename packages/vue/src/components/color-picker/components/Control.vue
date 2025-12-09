<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface ColorPickerControlProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useColorPickerContext } from '../composables/use-color-picker-context'
import { useForwardExpose } from '~/composables'

defineProps<ColorPickerControlProps>()
const colorPicker = useColorPickerContext()
useForwardExpose()
</script>

<template>
  <ui.div v-bind="colorPicker.getControlProps()" :as-child="asChild">
    <slot />
  </ui.div>
</template>
