<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface ComboboxItemIndicatorProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useComboboxContext } from '../composables/use-combobox-context'
import { useComboboxItemPropsContext } from '../composables/use-combobox-item-props-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'ComboboxItemIndicator',
})

defineProps<ComboboxItemIndicatorProps>()
const combobox = useComboboxContext()
const itemProps = useComboboxItemPropsContext()
useForwardExpose()
</script>

<template>
  <ui.div v-bind="combobox.getItemIndicatorProps(itemProps)" :as-child="asChild">
    <slot />
  </ui.div>
</template>
