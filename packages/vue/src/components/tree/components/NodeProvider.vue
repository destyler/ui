<script lang="ts">
import type { NodeProps } from '@destyler/tree'
import type { TreeNode } from '~/utils/collection'

export interface TreeNodeProviderProps<T> extends NodeProps {
  node: T
}
</script>

<script setup lang="ts" generic="T extends TreeNode">
import { useForwardExpose } from '~/composables'
import { TreeNodePropsProvider } from '../composables/use-tree-node-props-context'

defineOptions({
  name: 'TreeNodeProvider',
})

const props = defineProps<TreeNodeProviderProps<T>>()
TreeNodePropsProvider(props)

useForwardExpose()
</script>

<template>
  <slot />
</template>
