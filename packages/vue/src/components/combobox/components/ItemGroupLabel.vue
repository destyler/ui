<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface ComboboxItemGroupLabelProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useComboboxContext } from '../composables/use-combobox-context'
import { useComboboxItemGroupPropsContext } from '../composables/use-combobox-item-group-props-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'ComboboxItemGroupLabel',
})

defineProps<ComboboxItemGroupLabelProps>()
const combobox = useComboboxContext()
const itemGroupProps = useComboboxItemGroupPropsContext()
useForwardExpose()
</script>

<template>
  <ui.div v-bind="combobox.getItemGroupLabelProps({ htmlFor: itemGroupProps.id })" :as-child="asChild">
    <slot />
  </ui.div>
</template>
