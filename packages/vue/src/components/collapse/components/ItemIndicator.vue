
<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface CollapseItemIndicatorProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { useForwardExpose } from '~/composables'
import { ui } from '~/factory'
import { useCollapseContext } from '../composables/use-collapse-context'
import { useCollapseItemPropsContext } from '../composables/use-collapse-item-props-context'

defineOptions({
  name: 'CollapseItemIndicator'
})

const props = defineProps<CollapseItemIndicatorProps>()
const collapse = useCollapseContext()
const itemProps = useCollapseItemPropsContext()
useForwardExpose()
</script>

<template>
  <ui.div v-bind="collapse.getItemIndicatorProps(itemProps)" :as-child="props.asChild">
    <slot />
  </ui.div>
</template>
