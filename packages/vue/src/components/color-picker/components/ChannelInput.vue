<script lang="ts">
import type { ChannelInputProps } from '@destyler/color-picker'
import type { PolymorphicProps } from '~/factory'

export interface ColorPickerChannelInputProps extends ChannelInputProps, PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useColorPickerContext } from '../composables/use-color-picker-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'ColorPickerChannelInput'
})

const props = defineProps<ColorPickerChannelInputProps>()
const colorPicker = useColorPickerContext()

useForwardExpose()
</script>

<template>
  <ui.input v-bind="colorPicker.getChannelInputProps(props)" :as-child="asChild">
    <slot />
  </ui.input>
</template>
