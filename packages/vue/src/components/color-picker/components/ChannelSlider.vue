<script lang="ts">
import type { ChannelProps } from '@destyler/color-picker'
import type { PolymorphicProps } from '~/factory'

export interface ColorPickerChannelSliderProps extends ChannelProps, PolymorphicProps {}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { ui } from '~/factory'
import { ColorPickerChannelPropsProvider } from '../composables/use-color-picker-channel-props-context'
import { useColorPickerContext } from '../composables/use-color-picker-context'
import { useColorPickerFormatPropsContext } from '../composables/use-color-picker-format-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'ColorPickerChannelSlider'
})

const props = defineProps<ColorPickerChannelSliderProps>()

const colorPicker = useColorPickerContext()
const formatProps = useColorPickerFormatPropsContext()
const channelSliderProps = computed(() => ({ ...props, ...formatProps }))

ColorPickerChannelPropsProvider(props)
useForwardExpose()
</script>

<template>
  <ui.div v-bind="colorPicker.getChannelSliderProps(channelSliderProps)" :as-child="asChild">
    <slot />
  </ui.div>
</template>
