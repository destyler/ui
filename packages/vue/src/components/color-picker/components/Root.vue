<script lang="ts">
import type { BooleanDefaults } from '~/types'
import type { RenderStrategyProps } from '~/composables'
import type { PolymorphicProps } from '~/factory'
import type { RootEmits, RootProps } from '../types'

export interface ColorPickerRootProps extends RootProps, RenderStrategyProps, PolymorphicProps {}
export interface ColorPickerRootEmits extends RootEmits {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useColorPicker } from '../composables/use-color-picker'
import { ColorPickerProvider } from '../composables/use-color-picker-context'
import { RenderStrategyPropsProvider, useForwardExpose } from '~/composables'
import { computed } from 'vue'

defineOptions({
  name: 'ColorPickerRoot'
})

const props = withDefaults(defineProps<ColorPickerRootProps>(), {
  closeOnSelect: undefined,
  defaultOpen: undefined,
  disabled: undefined,
  invalid: undefined,
  open: undefined,
  openAutoFocus: undefined,
  readOnly: undefined,
  required: undefined,
} satisfies BooleanDefaults<RootProps>)

const emits = defineEmits<ColorPickerRootEmits>()

const colorPicker = useColorPicker(props, emits)
ColorPickerProvider(colorPicker)

RenderStrategyPropsProvider(computed(() => ({ lazyMount: props.lazyMount, unmountOnExit: props.unmountOnExit })))

useForwardExpose()
</script>

<template>
  <ui.div v-bind="colorPicker.getRootProps()" :as-child="asChild">
    <slot />
  </ui.div>
</template>
