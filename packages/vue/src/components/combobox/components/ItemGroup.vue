<script lang="ts">
import type { ItemGroupProps } from '@destyler/combobox'
import type { PolymorphicProps } from '~/factory'

export interface ComboboxItemGroupProps extends Partial<ItemGroupProps>, PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useComboboxContext } from '../composables/use-combobox-context'
import { ComboboxItemGroupPropsProvider } from '../composables/use-combobox-item-group-props-context'
import { useId } from 'vue'
import { useForwardExpose } from '~/composables'

const props = defineProps<ComboboxItemGroupProps>()
const combobox = useComboboxContext()
const id = props.id ?? useId()

ComboboxItemGroupPropsProvider({ id })
useForwardExpose()
</script>

<template>
  <ui.div v-bind="combobox.getItemGroupProps({ id })" :as-child="asChild">
    <slot />
  </ui.div>
</template>
