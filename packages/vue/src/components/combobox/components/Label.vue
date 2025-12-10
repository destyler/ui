<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface ComboboxLabelProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useComboboxContext } from '../composables/use-combobox-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'ComboboxLabel',
})

defineProps<ComboboxLabelProps>()
const combobox = useComboboxContext()

useForwardExpose()
</script>

<template>
  <ui.label v-bind="combobox.getLabelProps()" :as-child="asChild">
    <slot />
  </ui.label>
</template>
