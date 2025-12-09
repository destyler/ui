<script lang="ts">
import type { SlotsType, UnwrapRef } from 'vue'
import type { UseColorPickerContext } from '../composables/use-color-picker-context'

export interface ColorPickerContextProps
  extends SlotsType<{
    default: UnwrapRef<UseColorPickerContext>
  }> {}
</script>

<script setup lang="ts">
import { useColorPickerContext } from '../composables/use-color-picker-context'

defineOptions({
  name: 'ColorPickerContext'
})

const colorPicker = useColorPickerContext()

defineSlots<{
  default(colorPicker: UnwrapRef<UseColorPickerContext>): unknown
}>()
</script>

<template>
  <slot v-bind="colorPicker"></slot>
</template>
