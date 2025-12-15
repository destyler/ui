<script lang="ts">
import type { ItemGroupProps } from '@destyler/select'
import type { PolymorphicProps } from '~/factory'

export interface SelectItemGroupProps extends Partial<ItemGroupProps>, PolymorphicProps {}
</script>

<script setup lang="ts">
import { useId } from 'vue'
import { ui } from '~/factory'
import { useSelectContext } from '../composables/use-select-context'
import { SelectItemGroupPropsProvider } from '../composables/use-select-item-group-props-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'SelectItemGroup'
})

const props = defineProps<SelectItemGroupProps>()

const select = useSelectContext()
const id = props.id ?? useId()

SelectItemGroupPropsProvider({ id })

useForwardExpose()
</script>

<template>
  <ui.div v-bind="select.getItemGroupProps({ id })" :as-child="asChild">
    <slot />
  </ui.div>
</template>
