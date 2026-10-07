<script lang="ts">
import type { NodeProps } from '@destyler/tree'
import type { TreeNode } from '~/utils/collection'

export interface TreeNodeProviderProps<T> extends NodeProps {
  node: T
}
</script>

<script setup lang="ts" generic="T extends TreeNode">
import { computed } from 'vue'
import { useForwardExpose } from '~/composables'
import { useTreeContext } from '../composables/use-tree-context'
import { TreeNodeProvider as TreeNodeStateProvider } from '../composables/use-tree-node-context'
import { TreeNodePropsProvider } from '../composables/use-tree-node-props-context'

defineOptions({
  name: 'TreeNodeProvider',
})

const props = defineProps<TreeNodeProviderProps<T>>()
const tree = useTreeContext()
TreeNodeStateProvider(computed(() => tree.value.getNodeState(props)))
TreeNodePropsProvider(props)

useForwardExpose()
</script>

<template>
  <slot />
</template>
