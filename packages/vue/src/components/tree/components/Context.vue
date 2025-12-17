<script lang="ts">
import type { SlotsType, UnwrapRef } from 'vue'
import type { TreeNode } from '~/utils/collection'
import type { UseTreeContext } from '../composables/use-tree-context'

export interface TreeContextProps<T extends TreeNode>
  extends SlotsType<{
    default: UnwrapRef<UseTreeContext<T>>
  }> {}
</script>

<script setup lang="ts" generic="T extends TreeNode">
import { useTreeContext } from '../composables/use-tree-context'

defineOptions({
  name: 'TreeContext',
})

const treeView = useTreeContext()

defineSlots<{
  default(treeView: UnwrapRef<UseTreeContext<T>>): unknown
}>()
</script>

<template>
  <slot v-bind="treeView" />
</template>
