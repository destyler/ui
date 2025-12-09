<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface ColorPickerChannelSliderTrackProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { ui } from '~/factory'
import { useColorPickerChannelPropsContext } from '../composables/use-color-picker-channel-props-context'
import { useColorPickerContext } from '../composables/use-color-picker-context'
import { useColorPickerFormatPropsContext } from '../composables/use-color-picker-format-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'ColorPickerChannelSliderTrack'
})

defineProps<ColorPickerChannelSliderTrackProps>()
const colorPicker = useColorPickerContext()

const formatProps = useColorPickerFormatPropsContext()
const channelProps = useColorPickerChannelPropsContext()
const channelSliderProps = computed(() => ({ ...channelProps, ...formatProps }))

useForwardExpose()
</script>

<template>
  <ui.div v-bind="colorPicker.getChannelSliderTrackProps(channelSliderProps)" :as-child="asChild">
    <slot />
  </ui.div>
</template>
