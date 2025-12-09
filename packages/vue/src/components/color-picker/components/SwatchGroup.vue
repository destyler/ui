<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface ColorPickerSwatchGroupProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { colorPickerAnatomy } from '../anatomy'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'ColorPickerSwatchGroup'
})

defineProps<ColorPickerSwatchGroupProps>()
useForwardExpose()
</script>

<template>
  <ui.div v-bind="colorPickerAnatomy.build().swatchGroup.attrs" :as-child="asChild">
    <slot />
  </ui.div>
</template>
