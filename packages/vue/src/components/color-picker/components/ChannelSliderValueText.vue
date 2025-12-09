<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface ColorPickerChannelSliderValueTextProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { DEFAULT_LOCALE, useLocaleContext } from '~/providers'
import { ui } from '~/factory'
import { useColorPickerChannelPropsContext } from '../composables/use-color-picker-channel-props-context'
import { useColorPickerContext } from '../composables/use-color-picker-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'ColorPickerChannelSliderValueText'
})

defineProps<ColorPickerChannelSliderValueTextProps>()
const colorPicker = useColorPickerContext()
const channelProps = useColorPickerChannelPropsContext()
const slots = defineSlots()
const localeContext = useLocaleContext(DEFAULT_LOCALE)

useForwardExpose()
</script>

<template>
  <ui.span v-bind="colorPicker.getChannelSliderValueTextProps(channelProps)" :as-child="asChild">
    <slot>
      {{ slots.default?.() || colorPicker.getChannelValueText(channelProps.channel, localeContext.locale) }}
    </slot>
  </ui.span>
</template>
