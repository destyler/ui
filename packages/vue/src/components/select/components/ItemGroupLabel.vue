<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface SelectItemGroupLabelProps extends PolymorphicProps {}</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useSelectContext } from '../composables/use-select-context'
import { useSelectItemGroupPropsContext } from '../composables/use-select-item-group-props-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'SelectItemGroupLabel'
})

defineProps<SelectItemGroupLabelProps>()

const select = useSelectContext()
const itemGroupProps = useSelectItemGroupPropsContext()

useForwardExpose()
</script>

<template>
  <ui.div v-bind="select.getItemGroupLabelProps({ htmlFor: itemGroupProps.id })" :as-child="asChild">
    <slot />
  </ui.div>
</template>
