<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface ColorPickerHiddenInputProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useColorPickerContext } from '../composables/use-color-picker-context'
import { useFieldContext } from '~/components/field'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'ColorPickerHiddenInput'
})

defineProps<ColorPickerHiddenInputProps>()
const colorPicker = useColorPickerContext()
const field = useFieldContext()

useForwardExpose()
</script>

<template>
  <ui.input :aria-describedby="field?.ariaDescribedby" v-bind="colorPicker.getHiddenInputProps()" :as-child="asChild">
    <slot />
  </ui.input>
</template>
