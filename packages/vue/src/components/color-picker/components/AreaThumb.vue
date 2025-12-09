<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface ColorPickerAreaThumbProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useColorPickerAreaPropsContext } from '../composables/use-color-picker-area-props-context'
import { useColorPickerContext } from '../composables/use-color-picker-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'ColorPickerAreaThumb'
})

defineProps<ColorPickerAreaThumbProps>()
const colorPicker = useColorPickerContext()
const areaProps = useColorPickerAreaPropsContext()

useForwardExpose()
</script>

<template>
  <ui.div v-bind="colorPicker.getAreaThumbProps(areaProps)" :as-child="asChild">
    <slot />
  </ui.div>
</template>
