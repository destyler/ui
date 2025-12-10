<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface ComboboxControlProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useComboboxContext } from '../composables/use-combobox-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'ComboboxControl',
})

defineProps<ComboboxControlProps>()
const combobox = useComboboxContext()
useForwardExpose()
</script>

<template>
  <ui.div v-bind="combobox.getControlProps()" :as-child="asChild">
    <slot />
  </ui.div>
</template>
