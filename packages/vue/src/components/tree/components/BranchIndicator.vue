<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface TreeBranchIndicatorProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { useForwardExpose } from '~/composables'
import { ui } from '~/factory'
import { useTreeContext } from '../composables/use-tree-context'
import { useTreeNodePropsContext } from '../composables/use-tree-node-props-context'

defineOptions({
  name: 'TreeBranchIndicator',
})

defineProps<TreeBranchIndicatorProps>()

const treeView = useTreeContext()
const nodeProps = useTreeNodePropsContext()

useForwardExpose()
</script>

<template>
  <ui.div v-bind="treeView.getBranchIndicatorProps(nodeProps)" :as-child="asChild">
    <slot />
  </ui.div>
</template>
