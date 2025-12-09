<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface ColorPickerAreaBackgroundProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useColorPickerAreaPropsContext } from '../composables/use-color-picker-area-props-context'
import { useColorPickerContext } from '../composables/use-color-picker-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'ColorPickerAreaBackground'
})

defineProps<ColorPickerAreaBackgroundProps>()
const colorPicker = useColorPickerContext()
const areaProps = useColorPickerAreaPropsContext()

useForwardExpose()
</script>

<template>
  <ui.div v-bind="colorPicker.getAreaBackgroundProps(areaProps)" :as-child="asChild">
    <slot />
  </ui.div>
</template>
