<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface ColorPickerChannelSliderLabelProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useColorPickerChannelPropsContext } from '../composables/use-color-picker-channel-props-context'
import { useColorPickerContext } from '../composables/use-color-picker-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'ColorPickerChannelSliderLabel'
})

defineProps<ColorPickerChannelSliderLabelProps>()
const colorPicker = useColorPickerContext()
const channelProps = useColorPickerChannelPropsContext()
useForwardExpose()
</script>

<template>
  <ui.label v-bind="colorPicker.getChannelSliderLabelProps(channelProps)" :as-child="asChild">
    <slot />
  </ui.label>
</template>
