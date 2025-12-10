<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface ComboboxClearTriggerProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useComboboxContext } from '../composables/use-combobox-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'ComboboxClearTrigger',
})

defineProps<ComboboxClearTriggerProps>()
const combobox = useComboboxContext()

useForwardExpose()
</script>

<template>
  <ui.button v-bind="combobox.getClearTriggerProps()" :as-child="asChild">
    <slot />
  </ui.button>
</template>
