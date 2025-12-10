<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface ComboboxItemTextProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useComboboxContext } from '../composables/use-combobox-context'
import { useComboboxItemPropsContext } from '../composables/use-combobox-item-props-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'ComboboxItemText',
})

defineProps<ComboboxItemTextProps>()
const combobox = useComboboxContext()
const itemProps = useComboboxItemPropsContext()
useForwardExpose()
</script>

<template>
  <ui.span v-bind="combobox.getItemTextProps(itemProps)" :as-child="asChild">
    <slot />
  </ui.span>
</template>
