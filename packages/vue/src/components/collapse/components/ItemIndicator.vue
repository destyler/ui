
<script lang="ts">
import type { HTMLAttributes } from 'vue'
import type { PolymorphicProps } from '~/factory'

export interface CollapseItemIndicatorBaseProps extends PolymorphicProps {}
export interface CollapseItemIndicatorProps
  extends /* @vue-ignore */ CollapseItemIndicatorBaseProps,
    /* @vue-ignore */ HTMLAttributes {}
</script>

<script setup lang="ts">
import { useForwardExpose } from '~/composables'
import { ui } from '~/factory'
import { useCollapseContext } from '../composables/use-collapse-context'
import { useCollapseItemPropsContext } from '../composables/use-collapse-item-props-context'

defineProps<CollapseItemIndicatorProps>()
const collapse = useCollapseContext()
const itemProps = useCollapseItemPropsContext()
useForwardExpose()
</script>

<template>
  <ui.div v-bind="collapse.getItemIndicatorProps(itemProps)" :as-child="asChild">
    <slot />
  </ui.div>
</template>
