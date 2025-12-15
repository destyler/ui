<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface SelectItemTextProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useSelectContext } from '../composables/use-select-context'
import { useSelectItemPropsContext } from '../composables/use-select-item-props-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'SelectItemText'
})

defineProps<SelectItemTextProps>()

const select = useSelectContext()
const itemProps = useSelectItemPropsContext()

useForwardExpose()
</script>

<template>
  <ui.span v-bind="select.getItemTextProps(itemProps)" :as-child="asChild">
    <slot />
  </ui.span>
</template>
