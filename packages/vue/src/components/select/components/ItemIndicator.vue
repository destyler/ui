<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface SelectItemIndicatorProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useSelectContext } from '../composables/use-select-context'
import { useSelectItemPropsContext } from '../composables/use-select-item-props-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'SelectItemIndicator'
})

defineProps<SelectItemIndicatorProps>()

const select = useSelectContext()
const itemProps = useSelectItemPropsContext()

useForwardExpose()
</script>

<template>
  <ui.div v-bind="select.getItemIndicatorProps(itemProps)" :as-child="asChild">
    <slot />
  </ui.div>
</template>
