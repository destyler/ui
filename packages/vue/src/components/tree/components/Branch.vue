<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface TreeBranchProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { useForwardExpose, useRenderStrategyProps } from '~/composables'
import { Collapsible } from '~/components/collapsible'
import { useTreeContext } from '../composables/use-tree-context'
import { useTreeNodePropsContext } from '../composables/use-tree-node-props-context'
import { computed } from 'vue'

defineOptions({
  name: 'TreeBranch',
})

defineProps<TreeBranchProps>()

const treeView = useTreeContext()
const nodeProps = useTreeNodePropsContext()
const renderStrategyProps = useRenderStrategyProps()
const nodeState = computed(() => treeView.value.getNodeState(nodeProps))
const branchContentProps = computed(() => treeView.value.getBranchContentProps(nodeProps))

useForwardExpose()
</script>

<template>
  <Collapsible.Root
    :open="nodeState.expanded"
    :ids="{ content: branchContentProps.id }"
    v-bind="treeView.getBranchProps(nodeProps)"
    :lazy-mount="renderStrategyProps.lazyMount"
    :unmount-on-exit="renderStrategyProps.unmountOnExit"
    :as-child="asChild"
  >
    <slot />
  </Collapsible.Root>
</template>
